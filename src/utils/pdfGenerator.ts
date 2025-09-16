import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateNumerologyPDF = async (name: string, birthDate: Date) => {
  try {
    // Get the main content area (excluding the fixed header buttons)
    const element = document.querySelector('.numerology-content') as HTMLElement;
    
    if (!element) {
      throw new Error('Content element not found');
    }

    // Temporarily hide fixed elements during PDF generation
    const fixedElements = document.querySelectorAll('.fixed');
    fixedElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Create canvas from HTML content
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth
    });

    // Restore fixed elements
    fixedElements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    
    // If content is too tall, we'll need multiple pages
    const totalPages = Math.ceil(finalHeight / pdfHeight);
    
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      
      const yOffset = -page * pdfHeight;
      pdf.addImage(imgData, 'PNG', 0, yOffset, finalWidth, finalHeight);
    }

    // Save the PDF
    const fileName = `mapa-numerologico-${name.replace(/\s+/g, '-').toLowerCase()}-${birthDate.toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};