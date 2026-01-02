# Razorpay Payment Gateway Setup

## Issue
The payment gateway is not configured. You need to add your Razorpay API keys to Render.

## Steps to Configure Razorpay

### 1. Get Your Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Log in to your account
3. Go to **Settings** → **API Keys**
4. If you don't have keys, click **Generate Test Key** (for testing) or **Generate Live Key** (for production)

You'll need:
- **Key ID** (starts with `rzp_test_` for test or `rzp_live_` for live)
- **Key Secret** (shown only once when generated - save it!)

### 2. Add Keys to Render Dashboard

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Select your **morpankh-saree** service
3. Click on **Environment** in the left sidebar
4. Scroll down to **Environment Variables** section
5. Add these two environment variables:

#### Add `RAZORPAY_KEY_ID`:
   - **Key**: `RAZORPAY_KEY_ID`
   - **Value**: Your Razorpay Key ID (e.g., `rzp_test_xxxxxxxxxxxxx`)
   - Click **Save Changes**

#### Add `RAZORPAY_KEY_SECRET`:
   - **Key**: `RAZORPAY_KEY_SECRET`
   - **Value**: Your Razorpay Key Secret (the secret key)
   - Click **Save Changes**

#### Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`:
   - **Key**: `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Value**: Your Razorpay Key ID (same as RAZORPAY_KEY_ID)
   - Click **Save Changes**

#### Add `RAZORPAY_WEBHOOK_SECRET` (Optional but Recommended):
   - **Key**: `RAZORPAY_WEBHOOK_SECRET`
   - **Value**: Your Razorpay Webhook Secret (get this from Razorpay Dashboard → Settings → Webhooks)
   - If not set, the system will use `RAZORPAY_KEY_SECRET` as fallback
   - Click **Save Changes**

### 3. Configure Razorpay Webhook (Recommended)

Webhooks ensure payment status is updated even if the user closes the browser:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **Webhooks**
3. Click **Add New Webhook**
4. Set the **Webhook URL** to: `https://your-domain.com/api/payments/razorpay/webhook`
   - Replace `your-domain.com` with your actual domain
   - For local testing: Use a tool like [ngrok](https://ngrok.com/) to expose your local server
5. Select these events:
   - ✅ `payment.captured` (most important)
   - ✅ `payment.failed` (optional but recommended)
6. Click **Create Webhook**
7. Copy the **Webhook Secret** and add it as `RAZORPAY_WEBHOOK_SECRET` in Render (see step 2 above)

### 4. Restart Your Service

After adding the environment variables:
1. Click **Manual Deploy** → **Deploy latest commit**
2. Or wait for automatic deployment (if enabled)
3. Wait for deployment to complete

### 4. Verify Setup

After deployment, check the logs:
- Look for: ✅ No "Razorpay keys not configured" warnings
- Test the checkout flow again

## Environment Variables Needed

| Variable Name | Description | Example | Required |
|--------------|-------------|---------|----------|
| `RAZORPAY_KEY_ID` | Razorpay API Key ID (backend) | `rzp_test_xxxxxxxxxxxxx` | ✅ Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret (backend) | `your_secret_key_here` | ✅ Yes |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID (frontend) | `rzp_test_xxxxxxxxxxxxx` | ✅ Yes |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret | `whsec_xxxxxxxxxxxxx` | ⚠️ Optional (recommended) |

## Test vs Live Keys

### For Testing (Development)
- Use **Test Keys** from Razorpay Dashboard
- Keys start with `rzp_test_`
- Use test cards: https://razorpay.com/docs/payments/test-cards/

### For Production
- Use **Live Keys** from Razorpay Dashboard
- Keys start with `rzp_live_`
- Requires Razorpay account activation and KYC

## Quick Setup Checklist

- [ ] Got Razorpay Key ID and Secret
- [ ] Added `RAZORPAY_KEY_ID` to Render
- [ ] Added `RAZORPAY_KEY_SECRET` to Render
- [ ] Added `NEXT_PUBLIC_RAZORPAY_KEY_ID` to Render
- [ ] Configured Razorpay webhook (recommended)
- [ ] Added `RAZORPAY_WEBHOOK_SECRET` to Render (if using webhooks)
- [ ] Restarted/deployed service
- [ ] Verified no errors in logs
- [ ] Tested checkout flow

## Troubleshooting

### Still Getting "Payment gateway not configured"
- ✅ Check environment variables are saved in Render
- ✅ Verify no typos in variable names (case-sensitive!)
- ✅ Restart the service after adding variables
- ✅ Check Render logs for any errors

### Payment Not Working
- ✅ Verify you're using correct keys (test vs live)
- ✅ Check Razorpay dashboard for any account restrictions
- ✅ Ensure webhook URL is configured in Razorpay (if using webhooks)

### Order Status Stays "PENDING" After Payment
- ✅ Check backend logs for payment verification errors
- ✅ Verify webhook is configured and receiving events
- ✅ Check that `verifyPayment` API call is completing successfully
- ✅ The webhook handler will automatically update order status even if frontend callback fails

### Test Cards
Use these test cards in Razorpay test mode:
- **Success**: `4111 1111 1111 1111`
- **Failure**: `5104 0600 0000 0008`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Security Notes

⚠️ **Never commit these keys to git!**  
✅ They are already in `.gitignore`  
✅ Use Render environment variables (already configured)  
✅ Keep secrets secure and rotate them periodically  

