import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  BrainCircuit, 
  Info, 
  Mail, 
  Menu, 
  X, 
  ShoppingBag,
  Layout,
  Cpu,
  ShieldCheck,
  BookOpen,
  LineChart,
  Briefcase,
  Box,
  Users
} from 'lucide-react';
import { useCartStore } from '../../../core/stores/cartStore';
import './PublicMobileNav.css';

export const PublicMobileNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { items, setIsOpen: setCartOpen } = useCartStore();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <div className="ao-public-mobile-bottom-nav">
        <button className="ao-mobile-tab" onClick={() => navigate('/')}>
          <Home size={22} />
          <span>Accueil</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => navigate('/login')}>
          <User size={22} />
          <span>Connexion</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => navigate('/ai')}>
          <BrainCircuit size={22} />
          <span>IA</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => navigate('/about')}>
          <Info size={22} />
          <span>À Propos</span>
        </button>
        <button className="ao-mobile-tab" onClick={() => navigate('/contact')}>
          <Mail size={22} />
          <span>Contact</span>
        </button>
      </div>

      {/* Hamburger Toggle (Rendered in Header, but can be managed here or passed via Context. Let's just put the trigger button in the Header and state here... Wait, they are separate components. 
          Actually, I can just render the Hamburger button fixed on top right, or just keep it in PublicHeader and use a state there.
          Wait, I'll export a globally callable drawer or just put it in RootApp.
          Let's just put the Hamburger button inside PublicHeader.tsx and manage the state there, and pass `isMenuOpen` to this component. */}
    </>
  );
};
