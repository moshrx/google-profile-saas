import SiteFooter from './SiteFooter';

export default function Footer({ simple = false, onOpenLegal }) {
  return <SiteFooter variant="listedpei" simple={simple} onOpenLegal={onOpenLegal} />;
}
