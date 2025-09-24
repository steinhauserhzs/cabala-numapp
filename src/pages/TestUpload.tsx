import React from 'react';
import { UploadProcessor } from '@/components/UploadProcessor';

export default function TestUpload() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Processar Novos Conteúdos</h1>
      <UploadProcessor />
    </div>
  );
}