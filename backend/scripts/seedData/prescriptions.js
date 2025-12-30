// 100 Prescriptions for Eyes Optical Management System
// Note: customer IDs will be set dynamically in seed script

const eyeTypes = ['distance', 'reading', 'bifocal', 'progressive', 'computer'];
const optometrists = [
  'Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. David Kim',
  'Dr. Jennifer Martinez', 'Dr. Robert Williams', 'Dr. Lisa Anderson', 'Dr. James Taylor',
  'Dr. Maria Garcia', 'Dr. Christopher Brown', 'Dr. Amanda Davis', 'Dr. Matthew Wilson',
  'Dr. Jessica Moore', 'Dr. Daniel Thompson', 'Dr. Ashley White', 'Dr. Kevin Harris',
  'Dr. Nicole Jackson', 'Dr. Brandon Martin', 'Dr. Samantha Lee', 'Dr. Tyler Young'
];

// Generate realistic prescription values
const generateEyePrescription = () => {
  const hasPrescription = Math.random() > 0.1; // 90% have prescription
  
  if (!hasPrescription) {
    return {
      sphere: 0,
      cylinder: 0,
      axis: null,
      add: null,
      pd: Math.floor(Math.random() * 10) + 58 // 58-68mm
    };
  }
  
  const sphere = (Math.random() > 0.5 ? -1 : 1) * (Math.random() * 6 + 0.25); // -6.25 to +6.25
  const cylinder = Math.random() > 0.3 ? -(Math.random() * 3 + 0.25) : 0; // 70% have astigmatism
  const axis = cylinder !== 0 ? Math.floor(Math.random() * 180) : null;
  const add = Math.random() > 0.6 ? Math.random() * 2.5 + 0.75 : null; // 40% need reading add
  const pd = Math.floor(Math.random() * 10) + 58; // 58-68mm
  
  return {
    sphere: Math.round(sphere * 4) / 4, // Round to nearest 0.25
    cylinder: cylinder !== 0 ? Math.round(cylinder * 4) / 4 : 0,
    axis: axis,
    add: add ? Math.round(add * 4) / 4 : null,
    pd
  };
};

export const generatePrescriptions = (customerIds) => {
  const prescriptions = [];
  
  for (let i = 0; i < 100; i++) {
    const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const eyeType = eyeTypes[Math.floor(Math.random() * eyeTypes.length)];
    const optometrist = optometrists[Math.floor(Math.random() * optometrists.length)];
    
    // Generate exam date (within last 2 years)
    const examDate = new Date();
    examDate.setDate(examDate.getDate() - Math.floor(Math.random() * 730));
    
    // Expiry date (1-2 years from exam)
    const expiryDate = new Date(examDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1 + Math.floor(Math.random() * 2));
    
    const rightEye = generateEyePrescription();
    const leftEye = generateEyePrescription();
    
    // Ensure PDs are similar (within 2mm)
    if (Math.abs(rightEye.pd - leftEye.pd) > 2) {
      leftEye.pd = rightEye.pd + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
    }
    
    prescriptions.push({
      customer: customerId,
      eyeType,
      rightEye,
      leftEye,
      optometrist,
      examDate,
      expiryDate,
      notes: Math.random() > 0.5 ? `Regular eye examination. Patient shows ${Math.random() > 0.5 ? 'stable' : 'improved'} vision.` : null,
      isActive: expiryDate > new Date() // Active if not expired
    });
  }
  
  return prescriptions;
};

