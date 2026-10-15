import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();

  const currentLang = i18n.language.startsWith('vi') ? 'vi' : 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={className}
      aria-label={currentLang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      title={currentLang === 'vi' ? 'Chuyển sang English' : 'Switch to Vietnamese'}
    >
      <Languages className="h-4 w-4 text-foreground-muted" />
      <span className="font-semibold text-xs tracking-wide">
        {currentLang === 'vi' ? 'VI' : 'EN'}
      </span>
      <span className="sr-only">
        {currentLang === 'vi' ? 'Đang dùng Tiếng Việt' : 'Using English'}
      </span>
    </Button>
  );
}
