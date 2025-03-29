import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useUnsavedChangesWarning(isDirty) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  // Handle browser/tab close events
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
  
  // Custom navigation handler
  const handleNavigation = (path) => {
    if (isDirty) {
      setShowPrompt(true);
      setPendingNavigation(path);
      return false;
    } else {
      navigate(path);
      return true;
    }
  };
  
  const confirmNavigation = () => {
    setShowPrompt(false);
    navigate(pendingNavigation);
  };
  
  const cancelNavigation = () => {
    setShowPrompt(false);
    setPendingNavigation(null);
  };
  
  return {
    showPrompt,
    pendingNavigation,
    handleNavigation,
    confirmNavigation,
    cancelNavigation
  };
}