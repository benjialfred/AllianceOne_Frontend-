import React, { useEffect, useState } from 'react';
import {
  Truck, Plus, Search, Mail, Phone, MapPin,
  CreditCard, FileText, ShoppingBag, AlertCircle
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { inventoryApi } from '../services/api';
import type { Supplier } from '../types';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    payment_terms: '30 jours fin de mois',
    tax_id: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await inventoryApi.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      setError('Le code et la raison sociale du fournisseur sont obligatoires.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await inventoryApi.createSupplier(formData);
      setIsNewSupplierOpen(false);
      setFormData({
        code: '',
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        payment_terms: '30 jours fin de mois',
        tax_id: ''
      });
      loadSuppliers();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du fournisseur.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    !searchQuery ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.contact_name && s.contact_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Annuaire des Fournisseurs"
        subtitle="Partenaires d'approvisionnement, conditions de règlement et historique des commandes."
        breadcrumbs={[{ label: 'Stock & Logistique' }, { label: 'Fournisseurs' }]}
        actions={
          <button
            onClick={() => setIsNewSupplierOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0e121b',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Plus size={14} />
            Nouveau Fournisseur
          </button>
        }
      />

      {/* Search */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f9f9fb',
          border: '1px solid #e2e4e9',
          borderRadius: '8px',
          padding: '6px 12px',
          maxWidth: '400px'
        }}>
          <Search size={15} color="#868c98" />
          <input
            type="text"
            placeholder="Rechercher par nom, code ou contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e4e9',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(14, 18, 27, 0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Truck size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0e121b' }}>
                  {sup.name}
                </h3>
                <div style={{ fontSize: '12px', color: '#868c98' }}>Code: {sup.code}</div>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#525866', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
              {sup.contact_name && (
                <div>Contact : <strong>{sup.contact_name}</strong></div>
              )}
              {sup.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#868c98" />
                  <a href={`mailto:${sup.email}`} style={{ color: '#6366f1', textDecoration: 'none' }}>{sup.email}</a>
                </div>
              )}
              {sup.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#868c98" />
                  <span>{sup.phone}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={14} color="#868c98" />
                <span>Règlement : {sup.payment_terms}</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f9f9fb',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              marginTop: 'auto'
            }}>
              <span style={{ color: '#525866' }}>Commandes d'achat</span>
              <span style={{ fontWeight: 700, color: '#0e121b' }}>{sup.orders_count || 0} émises</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Supplier Modal */}
      {isNewSupplierOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 18, 27, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e4e9',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f3f6' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0e121b' }}>
                Ajouter un Fournisseur
              </h3>
            </div>

            <form onSubmit={handleCreateSupplier} style={{ padding: '1.5rem' }}>
              {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="FOURN-04"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0e121b', marginBottom: '4px' }}>Raison Sociale *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tech Distrib Sarl"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Contact</label>
                  <input
                    type="text"
                    placeholder="Nom du commercial"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    placeholder="contact@fournisseur.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Téléphone</label>
                  <input
                    type="text"
                    placeholder="+237..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#525866', marginBottom: '4px' }}>Conditions de paiement</label>
                  <input
                    type="text"
                    placeholder="30 jours fin de mois"
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cdd0d5', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewSupplierOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cdd0d5', background: '#ffffff', color: '#525866', fontSize: '13px', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0e121b', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {submitting ? 'Création...' : 'Créer le Fournisseur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
