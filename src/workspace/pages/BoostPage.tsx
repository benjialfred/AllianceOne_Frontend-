import React, { useState, useEffect } from 'react';
import { TrendingUp, ShieldCheck, Zap, Instagram, Youtube, LayoutGrid, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../core/api/client';
import './BoostPage.css';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../core/stores/authStore';

interface BoostService {
  service: number;
  name: string;
  type: string;
  category: string;
  rate: string;
  selling_rate_xaf: string;
  min: number;
  max: number;
  refill: boolean;
}

export const BoostPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const [services, setServices] = useState<BoostService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [categories, setCategories] = useState<string[]>([]);
  
  const [selectedService, setSelectedService] = useState<BoostService | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [targetLink, setTargetLink] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<BoostService[]>('/boost/services/');
        setServices(data);
        
        const cats = Array.from(new Set(data.map(s => s.category.split('-')[0].trim())));
        setCategories(['Tous', ...cats]);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les services de boost.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleSelectService = (service: BoostService) => {
    setSelectedService(service);
    setQuantity(service.min);
    setTargetLink('');
    setOrderSuccess(false);
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/boost');
      return;
    }

    if (!selectedService || quantity < selectedService.min || quantity > selectedService.max || !targetLink) {
      alert("Veuillez vérifier vos informations.");
      return;
    }
    
    try {
      setIsOrdering(true);
      await apiClient.post('/boost/orders/', {
        service_id: selectedService.service,
        target_link: targetLink,
        quantity: quantity
      });
      setOrderSuccess(true);
      setSelectedService(null);
      setTargetLink('');
    } catch (err: any) {
      console.error(err);
      alert("Une erreur est survenue lors de la commande. Veuillez réessayer.");
    } finally {
      setIsOrdering(false);
    }
  };

  const filteredServices = services.filter(s => 
    selectedCategory === 'Tous' ? true : s.category.includes(selectedCategory)
  );

  const calculateTotalPrice = (service: BoostService, qty: number) => {
    const rate = parseFloat(service.selling_rate_xaf);
    return Math.round((rate / 1000) * qty);
  };

  return (
    <div className="ao-boost-page">
      <div className="ao-boost-header">
        <div className="ao-boost-animated-bg">
          <div className="cube cube-1"></div>
          <div className="cube cube-2"></div>
          <div className="cube cube-3"></div>
          <div className="cube cube-4"></div>
          <div className="cube cube-5"></div>
          <div className="glow-sphere sphere-1"></div>
          <div className="glow-sphere sphere-2"></div>
        </div>
        
        <div className="ao-boost-header-content">
          <div className="ao-boost-badge">
            <TrendingUp size={16} />
            <span>NOUVEAU</span>
          </div>
          <h1>Alliance Boost</h1>
          <p>
            Propulsez vos réseaux sociaux vers de nouveaux sommets. Obtenez des vues, des abonnés 
            et des interactions réelles, instantanément et en toute sécurité.
          </p>
        </div>
        <div className="ao-boost-stats">
          <div className="stat-card">
            <Zap size={24} className="stat-icon text-yellow-400" />
            <div className="stat-info">
              <span className="stat-value">Instantanné</span>
              <span className="stat-label">Livraison rapide</span>
            </div>
          </div>
          <div className="stat-card">
            <ShieldCheck size={24} className="stat-icon text-green-400" />
            <div className="stat-info">
              <span className="stat-value">100% Sécurisé</span>
              <span className="stat-label">Sans mot de passe</span>
            </div>
          </div>
        </div>
      </div>

      {orderSuccess && (
        <div className="ao-boost-success-banner">
          <CheckCircle2 size={24} />
          <div>
            <h4>Commande passée avec succès !</h4>
            <p>Votre boost a été envoyé à nos serveurs et commencera d'ici quelques minutes. Suivez-le dans votre historique.</p>
          </div>
        </div>
      )}

      <div className="ao-boost-layout">
        <div className="ao-boost-catalog">
          <div className="ao-boost-filters">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`ao-boost-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'Tous' ? <LayoutGrid size={16} /> : null}
                {cat.includes('Instagram') && <Instagram size={16} />}
                {cat.includes('YouTube') && <Youtube size={16} />}
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="ao-boost-loading">
              <div className="spinner"></div>
              <p>Connexion à nos serveurs de diffusion...</p>
            </div>
          ) : error ? (
            <div className="ao-boost-error">
              <AlertCircle size={32} />
              <p>{error}</p>
            </div>
          ) : (
            <div className="ao-boost-grid">
              {filteredServices.map(service => (
                <div 
                  key={service.service} 
                  className={`ao-boost-card ${selectedService?.service === service.service ? 'selected' : ''}`}
                  onClick={() => handleSelectService(service)}
                >
                  <div className="service-category">{service.category}</div>
                  <h3 className="service-name">{service.name}</h3>
                  <div className="service-details">
                    <span><TrendingUp size={14}/> Min: {service.min}</span>
                    <span>Max: {service.max.toLocaleString()}</span>
                  </div>
                  <div className="service-price">
                    {parseFloat(service.selling_rate_xaf).toLocaleString()} XAF <span className="price-unit">/ 1000</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedService && (
          <div className="ao-boost-checkout">
            <div className="checkout-sticky">
              <h2>Configurer votre Boost</h2>
              <div className="checkout-service-summary">
                <span className="summary-cat">{selectedService.category}</span>
                <h4>{selectedService.name}</h4>
              </div>

              <div className="checkout-form">
                <div className="form-group">
                  <label>Lien cible (URL publique)</label>
                  <input 
                    type="url" 
                    placeholder="ex: https://instagram.com/p/..." 
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                  />
                  <span className="form-hint">Le compte doit être public.</span>
                </div>

                <div className="form-group">
                  <label>Quantité souhaitée</label>
                  <input 
                    type="number" 
                    min={selectedService.min}
                    max={selectedService.max}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || selectedService.min)}
                  />
                  <div className="range-hints">
                    <span>Min: {selectedService.min}</span>
                    <span>Max: {selectedService.max}</span>
                  </div>
                </div>

                <div className="checkout-total">
                  <span>Total à payer</span>
                  <span className="total-amount">
                    {calculateTotalPrice(selectedService, quantity).toLocaleString()} XAF
                  </span>
                </div>

                <button 
                  className="checkout-btn" 
                  onClick={handleOrder}
                  disabled={isAuthenticated ? (isOrdering || !targetLink || quantity < selectedService.min) : false}
                >
                  {isAuthenticated ? (isOrdering ? 'Traitement...' : 'Lancer le Boost 🚀') : 'Connexion requise 🚀'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
