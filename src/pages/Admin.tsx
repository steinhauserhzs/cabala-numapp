import { AdminUpload } from '@/components/AdminUpload';
import AdminHeader from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="Upload de Conteúdo" 
        description="Gerencie o conteúdo numerológico do sistema"
      />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <AdminUpload />
      </div>
    </div>
  );
};

export default Admin;