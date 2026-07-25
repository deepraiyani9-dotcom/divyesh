import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import { COMPANY } from '../../utils/constants';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-secondary mb-3">{title}</h2>
    <div className="text-muted leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <>
      <SEO title="Privacy Policy" description="Read Lotus Agritech's privacy policy regarding data collection, usage and protection." />
      <PageHero title="Privacy Policy" subtitle="Last updated: January 2026" breadcrumb={[{ label: 'Privacy Policy' }]} />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <Section title="Introduction">
            <p>
              {COMPANY.name} ("we", "our", "us") respects your privacy and is committed to protecting the personal
              information you share with us through our website and communication channels. This policy explains
              what information we collect, how we use it, and your rights regarding that information.
            </p>
          </Section>

          <Section title="Information We Collect">
            <p>We may collect the following types of information when you interact with our website:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Contact details such as name, email address, phone number and company name.</li>
              <li>Enquiry and quote request details, including product interests and quantities.</li>
              <li>Job application information, including resume/CV documents.</li>
              <li>Newsletter subscription email addresses.</li>
              <li>Technical data such as browser type, device information and IP address for analytics.</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2">
              <li>To respond to your enquiries, quote requests and job applications.</li>
              <li>To send you requested brochures, newsletters and product updates.</li>
              <li>To improve our website, products and customer service.</li>
              <li>To comply with legal obligations where applicable.</li>
            </ul>
          </Section>

          <Section title="Data Protection">
            <p>
              We implement reasonable technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure or destruction. However, no method of transmission
              over the internet is completely secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="Third-Party Sharing">
            <p>
              We do not sell or rent your personal information to third parties. We may share information with
              trusted service providers who assist us in operating our website and conducting business, subject to
              confidentiality obligations.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>
              You may request access to, correction of, or deletion of your personal data by contacting us at{' '}
              <a href={`mailto:${COMPANY.email}`} className="text-primary font-medium">
                {COMPANY.email}
              </a>
              . You may also unsubscribe from our newsletter at any time.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have questions about this Privacy Policy, please contact us at {COMPANY.phoneDisplay} or{' '}
              {COMPANY.email}.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
