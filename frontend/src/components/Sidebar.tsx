// frontend/src/components/Sidebar.tsx

"use client";
import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import { UserRole } from '@/types/enums'; // Chemin corrigé pour pointer vers le nouveau fichier

const Sidebar = () => {
  const authContext = useContext(AuthContext);
  const pathname = usePathname();

  if (!authContext?.user) {
    return null;
  }

  const clientLinks = [
    { href: '/dashboard', icon: 'fas fa-th-large', label: 'Tableau de bord' },
    { href: '/dashboard/nouvelle-commande', icon: 'fas fa-plus-circle', label: 'Nouvelle Commande' },
    { href: '/dashboard/messagerie', icon: 'fas fa-comments', label: 'Messagerie' },
    { href: '/dashboard/profil', icon: 'fas fa-user', label: 'Mon Profil' },
  ];

  const transitaireLinks = [
    { href: '/dashboard', icon: 'fas fa-th-large', label: 'Tableau de bord' },
    { href: '/dashboard/depots', icon: 'fas fa-warehouse', label: 'Gérer mes Dépôts' },
    { href: '/dashboard/routes', icon: 'fas fa-route', label: 'Gérer mes Routes' },
    { href: '/dashboard/messagerie', icon: 'fas fa-comments', label: 'Messagerie' },
    { href: '/dashboard/profil', icon: 'fas fa-user-tie', label: 'Mon Profil Pro' },
  ];

  const links = authContext.user.role === UserRole.TRANSITAIRE ? transitaireLinks : clientLinks;

  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-menu">
          {links.map((link) => (
            <li key={link.href} className="sidebar-item">
              <Link
                href={link.href}
                className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
              >
                <i className={link.icon}></i>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;