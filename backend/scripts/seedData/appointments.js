// 100 Appointments for Eyes Optical Management System
// Note: customer and optometrist IDs will be set dynamically in seed script

const appointmentTypes = ['eye-exam', 'consultation', 'follow-up', 'fitting'];
const appointmentStatuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'];
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const generateAppointments = (customerIds, staffIds) => {
  const appointments = [];
  
  for (let i = 0; i < 100; i++) {
    const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
    const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    
    // Generate appointment date (mix of past, present, and future)
    const appointmentDate = new Date();
    const daysOffset = Math.floor(Math.random() * 180) - 30; // -30 to +150 days
    appointmentDate.setDate(appointmentDate.getDate() + daysOffset);
    
    // Only assign optometrist if status is confirmed, in-progress, or completed
    const optometristId = (status === 'confirmed' || status === 'in-progress' || status === 'completed') && staffIds.length > 0
      ? staffIds[Math.floor(Math.random() * staffIds.length)]
      : null;
    
    const duration = appointmentType === 'eye-exam' ? 60 : appointmentType === 'fitting' ? 45 : 30;
    
    appointments.push({
      customer: customerId,
      appointmentDate,
      appointmentTime: timeSlot,
      type: appointmentType,
      status,
      optometrist: optometristId,
      duration,
      notes: Math.random() > 0.4 ? [
        'Regular checkup',
        'Follow-up appointment',
        'New patient consultation',
        'Frame fitting',
        'Prescription update',
        'Emergency visit',
        'Annual examination',
        'Contact lens fitting'
      ][Math.floor(Math.random() * 8)] : null,
      reminderSent: status !== 'cancelled' && status !== 'no-show' && appointmentDate > new Date() && Math.random() > 0.3
    });
  }
  
  return appointments;
};

