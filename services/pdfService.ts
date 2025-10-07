import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FeePayment, Student, Room, Expense, FeeStatus } from '../types';

// Helper for currency formatting
const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const generateFeeReceiptPDF = (fee: FeePayment, student: Student, room: Room | undefined) => {
    const doc = new jsPDF();

    // --- Title ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Indus Boys Hostel Sukkur', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Fee Receipt', 105, 30, { align: 'center' });

    // --- Student & Receipt Info ---
    doc.setLineWidth(0.2);
    doc.line(15, 40, 195, 40);

    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 15, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(student.name, 15, 58);
    doc.text(`Student ID: ${student.id}`, 15, 66);
    doc.text(`Room: ${room?.roomNumber || 'N/A'} (${room?.type || 'N/A'})`, 15, 74);

    doc.setFont('helvetica', 'bold');
    doc.text(`Receipt #:`, 140, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(fee.id, 165, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Date:', 140, 58);
    doc.setFont('helvetica', 'normal');
    doc.text(fee.date, 165, 58);

    // --- Table ---
    autoTable(doc, {
        startY: 85,
        head: [['Description', 'Amount']],
        body: [[`Hostel Fee for ${fee.month}, ${fee.year}`, formatCurrency(fee.amount)]],
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175] }
    });

    // --- Total & Status ---
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', 140, finalY + 15);
    doc.text(formatCurrency(fee.amount), 195, finalY + 15, { align: 'right' });
    
    if (fee.status === FeeStatus.PAID) {
        doc.setFontSize(80);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 167, 69, 0.2); // Lighter watermark
        doc.text('PAID', 105, 140, { align: 'center', angle: -30 });
    }

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('This is a computer-generated receipt and does not require a signature.', 105, 285, { align: 'center' });

    doc.save(`receipt-${student.name.replace(' ','-')}-${fee.month}.pdf`);
}

export const generateFinancialReportPDF = (fees: FeePayment[], expenses: Expense[], students: Student[]) => {
    const doc = new jsPDF();
    const totalRevenue = fees.filter(f => f.status === FeeStatus.PAID).reduce((sum, f) => sum + f.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    const pageHeader = () => {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Indus Boys Hostel - Financial Report', 105, 18, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 195, 25, { align: 'right' });
        doc.setLineWidth(0.5);
        doc.line(15, 28, 195, 28);
    };

    const pageFooter = (data: any) => {
        const pageCount = data.doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, 195, 285, { align: 'right' });
    };

    // --- Cover Page / Summary ---
    pageHeader();
    doc.setFontSize(24);
    doc.text('Financial Summary', 105, 60, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`Total Revenue:`, 60, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(formatCurrency(totalRevenue), 150, 80, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text(`Total Expenses:`, 60, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(formatCurrency(totalExpenses), 150, 90, { align: 'right' });
    
    doc.setLineWidth(0.2);
    doc.line(60, 95, 150, 95);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Net Profit:`, 60, 105);
    doc.setTextColor(netProfit >= 0 ? 16 : 239, netProfit >=0 ? 185 : 68, netProfit >= 0 ? 129: 68);
    doc.text(formatCurrency(netProfit), 150, 105, { align: 'right' });
    doc.setTextColor(0,0,0);
    
    
    // --- Revenue Details Table ---
    doc.setFontSize(20);
    doc.text('Revenue Details (Paid Fees)', 15, 125);
    autoTable(doc, {
        startY: 130,
        head: [['Date', 'Student', 'Month', 'Amount']],
        body: fees.filter(f => f.status === FeeStatus.PAID)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(f => [f.date, students.find(s=>s.id === f.studentId)?.name || 'N/A', `${f.month}, ${f.year}`, formatCurrency(f.amount)]),
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175] },
        didDrawPage: (data) => {
            pageHeader();
            pageFooter(data);
        },
        margin: { top: 35 }
    });

    // --- Expense Details Table ---
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    if (finalY > 250) {
        doc.addPage();
        pageHeader();
        finalY = 40; // Reset Y position for the new page
    }
    doc.setFontSize(20);
    doc.text('Expense Details', 15, finalY);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Date', 'Title', 'Category', 'Amount']],
        body: expenses
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(e => [e.date, e.title, e.category, formatCurrency(e.amount)]),
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175] },
        didDrawPage: (data) => {
            pageHeader();
            pageFooter(data);
        },
        margin: { top: 35 }
    });


    doc.save(`Financial-Report-${new Date().toISOString().split('T')[0]}.pdf`);
};