import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { defineStore } from 'pinia';

export const useExport = defineStore('export', {
  actions: {
    async exportdata(data: []) {
      const doc = new jsPDF('p', 'pt', 'letter');
      doc.setFont('Amiri Regular');

      autoTable(doc, {
        styles: {
          cellWidth: 'auto',
          font: 'Amiri Regular',
          halign: 'right',
        },
        // head: [['', '', '']],
        body: data,
      });

      doc
        .save('table.pdf', {
          returnPromise: true,
        })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
  },
});
