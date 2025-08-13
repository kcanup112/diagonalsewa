# Tawk.to Live Chat Integration

## Setup Instructions

### 1. Create a Tawk.to Account
1. Go to https://www.tawk.to/
2. Sign up for a free account
3. Complete the registration process

### 2. Get Your Tawk.to Property ID and Widget ID
1. Log in to your Tawk.to dashboard
2. Go to **Administration** → **Property Settings**
3. Copy your **Property ID** (e.g., `5f8b1c2d3e4f5a6b7c8d9e0f`)
4. Copy your **Widget ID** (e.g., `1abc2def3ghi`)

### 3. Update the Component
1. Open `src/components/Chat/TawkToChat.js`
2. Replace `YOUR_PROPERTY_ID` with your actual Property ID
3. Replace `YOUR_WIDGET_ID` with your actual Widget ID

```javascript
// Replace these lines:
const TAWK_PROPERTY_ID = "YOUR_PROPERTY_ID";
const TAWK_WIDGET_ID = "YOUR_WIDGET_ID";

// With your actual IDs:
const TAWK_PROPERTY_ID = "5f8b1c2d3e4f5a6b7c8d9e0f";
const TAWK_WIDGET_ID = "1abc2def3ghi";
```

### 4. Customize Your Chat Widget
In your Tawk.to dashboard, you can:
- Customize the chat widget appearance
- Set up automated messages
- Configure business hours
- Add departments (Design, Construction, Repair, etc.)
- Set up triggers for proactive chat

### 5. Features Included
- ✅ Automatic loading on all pages
- ✅ Custom positioning (bottom-right)
- ✅ Event tracking for construction inquiries
- ✅ Mobile responsive
- ✅ Cleanup on component unmount
- ✅ Error handling

### 6. Customization Options
You can modify the chat behavior in `TawkToChat.js`:

```javascript
// Hide chat on specific pages
if (window.location.pathname === '/admin') {
  window.Tawk_API.hideWidget();
}

// Show chat only on specific pages
if (window.location.pathname === '/contact') {
  window.Tawk_API.showWidget();
}

// Pre-fill visitor information
window.Tawk_API.setAttributes({
  'name': 'John Doe',
  'email': 'john@example.com'
});
```

### 7. Testing
1. Save all files
2. Start your development server: `npm start`
3. Visit your website
4. Look for the chat widget in the bottom-right corner
5. Test the chat functionality

### 8. Troubleshooting
- Check browser console for any error messages
- Ensure your Property ID and Widget ID are correct
- Make sure your Tawk.to property is active
- Check if your website domain is added to allowed domains in Tawk.to dashboard

### 9. Business Hours Setup (Recommended)
1. In Tawk.to dashboard, go to **Messaging** → **Hours & Availability**
2. Set your business hours: **Sunday - Friday: 10:00 AM - 6:00 PM**
3. Set Saturday as closed
4. Configure offline messages for outside business hours

### 10. Department Setup (Optional)
Create departments for better customer service:
- **Design & Visualization**
- **Construction**
- **Repair & Maintenance**
- **General Inquiry**

This will help route customers to the right team member based on their needs.
