import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export interface DashboardGridProps {
  children: React.ReactNode;
  layouts: any;
  onLayoutChange?: (layout: any, layouts: any) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  layouts,
  onLayoutChange,
  isDraggable = true,
  isResizable = true,
}) => {
  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={30}
      onLayoutChange={onLayoutChange}
      isDraggable={isDraggable}
      isResizable={isResizable}
      margin={[24, 24]}
      containerPadding={[0, 0]}
    >
      {children}
    </ResponsiveGridLayout>
  );
};
