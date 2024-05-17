import { TablesAffiliates } from './components';

interface IAffiliateAdminProps {}

export const AffiliateAdmin: React.FC<IAffiliateAdminProps> = (props) => {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8 bg-white">
      <TablesAffiliates />
    </div>
  );
};
export default AffiliateAdmin;
