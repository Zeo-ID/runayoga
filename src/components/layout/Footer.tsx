import siteData from "../../data/site.json";

export function Footer() {
  const contact = siteData.contact;
  const legal = siteData.footer?.legal || [];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-3">
              {siteData.name}
            </h3>
            {siteData.tagline && (
              <p className="text-sm text-gray-400">{siteData.tagline}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Kontakt</h4>
            <div className="space-y-2 text-sm">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block hover:text-white transition-colors">
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="block hover:text-white transition-colors">
                  {contact.phone}
                </a>
              )}
              {contact.address && <p>{contact.address}</p>}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Rechtliches</h4>
            <div className="space-y-2 text-sm">
              {legal.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="block hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{siteData.footer?.copyright}</p>
          <div className="flex gap-4">
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram
              </a>
            )}
            {contact.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
