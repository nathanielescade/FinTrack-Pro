// Personalization features for Ghanaian users
const getDailyTip = () => {
  const tips = [
    "Track every expense, no matter how small. Small amounts in cedis add up over time!",
    "Set up automatic transfers to your savings account right after payday.",
    "Review your mobile money transactions monthly to identify unnecessary spending.",
    "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings with your Ghanaian cedis.",
    "Build an emergency fund that covers 3-6 months of expenses in Ghana's economy.",
    "Pay off high-interest debt before making new investments.",
    "Consider investing in Ghana Treasury Bills as a safe savings option.",
    "Compare prices at Makola, Kaneshie, and other markets before making major purchases.",
    "Set specific financial goals with deadlines that align with Ghana's economic calendar.",
    "Review your bank statements annually to check for unnecessary fees."
  ];
  
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return tips[dayOfYear % tips.length];
};

const getUpcomingReminder = () => {
  const reminders = loadData('reminders', []);
  const today = new Date();
  const upcoming = reminders.find(r => {
    const reminderDate = new Date(r.date);
    const diffTime = reminderDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  });
  
  if (upcoming) {
    return {
      text: upcoming.text,
      date: formatDate(upcoming.date)
    };
  }
  
  return null;
};

const initializeProfile = () => {
  // Profile picture functionality
  const profilePicBtn = document.getElementById('profile-pic-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  const changeProfilePic = document.getElementById('change-profile-pic');
  const profilePicModal = document.getElementById('profile-pic-modal');
  const cancelProfilePic = document.getElementById('cancel-profile-pic');
  
  if (profilePicBtn) {
    profilePicBtn.addEventListener('click', () => {
      profileDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!profilePicBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.add('hidden');
      }
    });
  }
  
  if (changeProfilePic) {
    changeProfilePic.addEventListener('click', () => {
      profileDropdown.classList.add('hidden');
      profilePicModal.classList.remove('hidden');
    });
  }
  
  if (cancelProfilePic) {
    cancelProfilePic.addEventListener('click', () => {
      profilePicModal.classList.add('hidden');
    });
  }
  
  // Profile picture selection
  const profileOptions = document.querySelectorAll('.profile-option');
  profileOptions.forEach(option => {
    option.addEventListener('click', () => {
      const pic = option.dataset.pic;
      localStorage.setItem('profilePic', pic);
      document.getElementById('profile-pic-btn').src = pic;
      profilePicModal.classList.add('hidden');
      showNotification('Profile picture updated!');
    });
  });
};

const initializeReminders = () => {
  // Set up default Ghana-specific reminders if none exist
  const reminders = loadData('reminders', []);
  if (reminders.length === 0) {
    const defaultReminders = [
      { text: 'ECG electricity bill payment', date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString().split('T')[0] },
      { text: 'Ghana Water bill payment', date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 20).toISOString().split('T')[0] },
      { text: 'Rent payment due', date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString().split('T')[0] }
    ];
    saveData('reminders', defaultReminders);
  }
};