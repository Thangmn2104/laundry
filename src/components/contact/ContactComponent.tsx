import { useState, useRef, useEffect } from 'react';
import { Phone, X, MessageCircle, ExternalLink } from 'lucide-react';
import '../../App.css';

interface ContactInfo {
    phone: string;
    zalo: string;
}

const ContactComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const contactPanelRef = useRef<HTMLDivElement>(null);
    const contactButtonRef = useRef<HTMLButtonElement>(null);

    // Example contact data - replace with your actual data
    const contactData: ContactInfo = {
        phone: "0865848439",
        zalo: "0865848439"
    };

    const toggleContact = () => {
        setIsOpen(!isOpen);
    };

    // Handle click outside to close the panel
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                contactPanelRef.current &&
                contactButtonRef.current &&
                !contactPanelRef.current.contains(event.target as Node) &&
                !contactButtonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="contact-container">
            {/* Contact Information Panel */}
            {isOpen && (
                <div className="contact-panel" ref={contactPanelRef}>
                    <div className="contact-header">
                        <h3>Liên hệ khi có sự cố</h3>
                        <button
                            className="close-button"
                            onClick={toggleContact}
                            aria-label="Close contact panel"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="contact-info">
                        <div className="contact-item">
                            <div className="contact-icon">
                                <Phone size={18} />
                            </div>
                            <div className="contact-text">
                                <strong>Điện thoại</strong>
                                <p>{contactData.phone}</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon zalo-icon">
                                <span className="zalo-icon-text">Z</span>
                            </div>
                            <div className="contact-text">
                                <strong>Zalo</strong>
                                <p>{contactData.zalo}</p>
                            </div>
                        </div>

                        <div className="social-links">
                            <a
                                href={`https://zalo.me/${contactData.zalo.replace(/\+|\s+/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link zalo-link"
                            >
                                Nhắn tin Zalo <ExternalLink size={14} />
                            </a>
                            <a
                                href={`tel:${contactData.phone.replace(/\s+/g, '')}`}
                                className="social-link phone-link"
                            >
                                Gọi ngay <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Icon Button */}
            <button
                className="contact-button"
                onClick={toggleContact}
                aria-label="Contact Support"
                ref={contactButtonRef}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
};

export default ContactComponent;
