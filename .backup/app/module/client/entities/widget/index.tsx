import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorBoundary } from './ErrorBoundary'

export interface WidgetWrapperProps {
  children: ReactNode;
  widgetName: string
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  children,
  widgetName,
}) => {
  const mark = performance.now();

  React.useEffect(() => {
    const elapsed = performance.now() - mark;
    console.log(`render widget: ${widgetName}`, elapsed/1_000);
  }, []);

  return (
      <ErrorBoundary
        fallbackComponent={<script>/* error render {widgetName}*/</script>}>
        {children}
      </ErrorBoundary>
  )
}