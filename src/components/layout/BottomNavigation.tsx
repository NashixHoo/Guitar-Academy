import React from 'react';
import { BottomNavBar } from './BottomNavBar';
import { PrimaryTab } from '../../services/navigationService';

export interface BottomNavigationProps {
  activePrimaryTab: PrimaryTab;
  onSelectPrimaryTab: (tab: PrimaryTab) => void;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = (props) => {
  return <BottomNavBar {...props} />;
};

export { BottomNavBar };
