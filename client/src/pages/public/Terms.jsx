import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import { COMPANY } from '../../utils/constants';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-ink mb-3">{title}</h2>
    <div className="text-muted leading-relaxed space-y-3">{children}</div>
  </div>
);

const Terms = () => {
  return (
    <>
      <SEO title="Terms & Conditions" description="Read the terms and conditions governing the use of Lotus Agritech's website and services." />
      <PageHero title="Terms & Conditions" subtitle="Last updated: January 2026" breadcrumb={[{ label: 'Terms & Conditions' }]} />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <Section title="Acceptance of Terms">
            <p>
              By accessing and using the {COMPANY.name} website, you agree to be bound by these Terms &amp;
              Conditions. If you do not agree with any part of these terms, please refrain from using our website.
            </p>
          </Section>

          <Section title="Products & Pricing">
            <p>
              All product information, specifications and prices listed on this website are subject to change
              without prior notice. Prices displayed are indicative and final pricing will be confirmed at the time
              of order placement through our sales team.
            </p>
          </Section>

          <Section title="Orders & Quotes">
            <p>
              Submission of a quote request or contact enquiry does not constitute a binding order. All orders are
              subject to confirmation, availability, and applicable terms of sale communicated by our sales team.
            </p>
          </Section>

          <Section title="Intellectual Property">
            <p>
              All content on this website, including text, images, logos and graphics, is the property of{' '}
              {COMPANY.name} and is protected under applicable intellectual property laws. Unauthorized use or
              reproduction is strictly prohibited.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              {COMPANY.name} shall not be liable for any indirect, incidental or consequential damages arising from
              the use of our website, products or services, to the extent permitted by applicable law.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These terms shall be governed by and construed in accordance with the laws of India, with jurisdiction
              vested in the courts of Gujarat.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              For any questions regarding these Terms &amp; Conditions, please contact us at {COMPANY.phoneDisplay} or{' '}
              {COMPANY.email}.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
};

export default Terms;
