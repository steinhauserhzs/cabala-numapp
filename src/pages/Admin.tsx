import { AdminUpload } from '@/components/AdminUpload';
import AdminHeader from '@/components/AdminHeader';

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="Upload de Conteúdo" 
        description="Gerencie o conteúdo numerológico do sistema"
      />
      <div className="container mx-auto px-4 py-8">
        <AdminUpload />
      </div>
    </div>
  );
};

export default Admin;