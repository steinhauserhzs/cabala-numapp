import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (
  name: string,
  birthDate: Date,
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    onProgress?.(10);
    
    // Find the main container
    const element = document.querySelector('.min-h-screen.bg-gradient-mystical') as HTMLElement;
    if (!element) {
      throw new Error('Elemento não encontrado para geração do PDF');
    }

    onProgress?.(30);

    // Generate canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      height: element.scrollHeight,
      width: element.scrollWidth
    });

    onProgress?.(70);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    onProgress?.(90);

    // Download the PDF
    const fileName = `mapa-numerologico-${name.replace(/\s+/g, '-').toLowerCase()}-${birthDate.toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    onProgress?.(100);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Erro ao gerar PDF. Tente novamente.');
  }
};