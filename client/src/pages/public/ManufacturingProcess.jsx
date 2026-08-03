import SEO from '../../components/common/SEO.jsx';
import PageHero from '../../components/common/PageHero.jsx';
import ContactCTA from '../../components/common/ContactCTA.jsx';
import ManufacturingFlow from '../../components/common/ManufacturingFlow.jsx';

const ManufacturingProcess = () => {
  return (
    <>
      <SEO
        title="Manufacturing Process"
        description="Learn about Lotus Agritech's precise, quality-controlled PVC & UPVC pipe manufacturing process."
      />
      <PageHero
        title="Manufacturing Process"
        subtitle="From raw resin to the finished pipe — a journey defined by precision and quality control."
        breadcrumb={[{ label: 'Manufacturing Process' }]}
      />

      <ManufacturingFlow showTitle />

      <ContactCTA />
    </>
  );
};

export default ManufacturingProcess;
