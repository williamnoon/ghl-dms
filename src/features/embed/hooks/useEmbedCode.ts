import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useEmbedCode() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  }, []);

  return { copied, copyToClipboard };
}