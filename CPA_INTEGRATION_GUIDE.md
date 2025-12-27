# CPA Network Integration Guide

This guide explains how to integrate your CPA dashboard with popular affiliate networks like ClickDealer, Trafee, and Adverten.

## Supported Networks

Currently, the dashboard supports integration with:

1. **ClickDealer** - International affiliate network with global offers
2. **Trafee** - Premium mobile and desktop CPA offers
3. **Adverten** - Smartlink and direct offers network

More networks can be added easily by extending the configuration.

## How Integration Works

### Postback URL System

Your dashboard provides a unique postback URL for each CPA network you configure. When a user completes an offer (conversion), the CPA network automatically sends a request to your postback URL with conversion details.

**Flow:**
1. User clicks your offer link with Sub ID tracking
2. User completes the action/offer
3. CPA network triggers postback to your dashboard
4. Your dashboard receives and records the conversion
5. Real-time statistics update automatically

## Step-by-Step Integration

### 1. Access Settings

1. Click the **Settings** button in the dashboard header
2. Navigate to the **Networks** tab

### 2. Add CPA Network

1. Click **Add Network** button
2. Select network type (ClickDealer, Trafee, or Adverten)
3. Enter your credentials:
   - **API Key** (required): Your API key from the network
   - **API Secret** (optional): Additional security for some networks
   - **Display Name** (optional): Custom name for easy identification
4. Click **Add Network**

### 3. Get Postback URL

After adding a network, you'll see a unique postback URL:

```
https://yourdomain.com/api/postback?network=clickdealer&api_key=YOUR_API_KEY&external_id={offer_id}&subid={subid}&revenue={revenue}&country={country}&status={status}
```

### 4. Configure Postback in CPA Network

#### ClickDealer

1. Login to your ClickDealer account
2. Go to **Postback URLs** or **Conversion Tracking** section
3. Add a new postback URL
4. Paste your dashboard's postback URL
5. Replace placeholders with ClickDealer variables:
   - `{offer_id}` - Offer ID
   - `{subid}` - Your Sub ID
   - `{revenue}` - Payout amount
   - `{status}` - Conversion status

Example postback format for ClickDealer:
```
https://yourdomain.com/api/postback?network=clickdealer&api_key=YOUR_API_KEY&external_id={offer_id}&subid={subid}&revenue={payout}&country={ctry}&status={status}
```

#### Trafee

1. Login to your Trafee account
2. Go to **API & Postbacks** section
3. Add your postback URL with Trafee variables:
   - `offer_id` - Trafee offer ID
   - `subid` - Your tracking Sub ID
   - `payout` - Conversion payout

Example postback format for Trafee:
```
https://yourdomain.com/api/postback?network=trafee&api_key=YOUR_API_KEY&external_id={offer_id}&subid={subid}&revenue={payout}&country={ctry}&status=approved
```

#### Adverten

1. Login to your Adverten account
2. Go to **Postback Settings** or **API Integration**
3. Configure postback with Adverten variables

Example postback format for Adverten:
```
https://yourdomain.com/api/postback?network=adverten&api_key=YOUR_API_KEY&external_id={offer_id}&subid={subid}&revenue={payout}&country={ctry}&status=approved
```

### 5. Test Your Integration

#### Manual Test

Test your postback endpoint manually:

```bash
curl -X GET "https://yourdomain.com/api/postback?network=clickdealer&api_key=YOUR_API_KEY&external_id=TEST123&subid=test_sub&revenue=2.50&country=US&status=approved"
```

Expected response:
```json
{
  "success": true,
  "message": "Conversion recorded successfully",
  "leadId": "clxxxxxx"
}
```

#### Real Test

1. Generate an affiliate link from your CPA network
2. Add a Sub ID: `?subid=test_integration`
3. Complete the offer yourself (use a test account)
4. Check your dashboard - you should see the conversion in **Recent Leads**

### 6. Monitor Conversions

- Check **Real-time Leads** in dashboard for immediate updates
- Monitor **Recent Clicks** for click tracking
- Review **Sub ID Reports** for performance breakdown

## API Endpoints

### Postback Endpoint

**URL:** `/api/postback`
**Methods:** GET, POST
**Parameters:**

| Parameter | Required | Description |
|-----------|-----------|-------------|
| `network` | Yes | Network name (clickdealer, trafee, adverten) |
| `api_key` | Yes | Your API key for validation |
| `external_id` | Yes | Offer/Conversion ID from network |
| `subid` | No | Sub ID for tracking |
| `revenue` | Yes | Payout amount |
| `country` | No | User's country code |
| `status` | No | Conversion status (approved, pending, rejected) |

### Network Management API

#### Get All Networks
```http
GET /api/networks
```

#### Add Network
```http
POST /api/networks
Content-Type: application/json

{
  "name": "clickdealer",
  "displayName": "My ClickDealer Account",
  "apiKey": "your_api_key",
  "apiSecret": "optional_secret",
  "postbackUrl": ""
}
```

#### Update Network
```http
PUT /api/networks/{id}
Content-Type: application/json

{
  "displayName": "Updated Name",
  "apiKey": "new_api_key",
  "status": "active"
}
```

#### Delete Network
```http
DELETE /api/networks/{id}
```

## Sub ID Tracking

Sub IDs allow you to track conversions by source, campaign, or traffic channel.

### Using Sub IDs in Links

Add Sub ID parameter to your affiliate links:

```
https://cpa-network.com/offer/12345?subid=campaign_facebook_us
```

Or for tracking specific sources:

```
https://cpa-network.com/offer/12345?subid=native_app_source1
```

### Sub ID Best Practices

- **Descriptive Names:** Use meaningful Sub IDs like `fb_us_android_v1`
- **Hierarchical:** Use format: `source_country_campaign_version`
- **Consistent:** Maintain naming convention across campaigns
- **Max Length:** Keep under 100 characters

### Analyzing Sub ID Performance

After receiving conversions, view **Sub ID Reports** in dashboard:

| Sub ID | Clicks | Leads | Revenue | Conversion Rate |
|---------|---------|--------|----------|-----------------|
| fb_us_android_v1 | 1,234 | 45 | $112.50 | 3.65% |
| gg_us_ios_v2 | 856 | 38 | $95.00 | 4.44% |

Optimize by:
- Pausing low-performing Sub IDs
- Scaling high-performing sources
- Testing different countries

## Troubleshooting

### Postback Not Receiving Conversions

**Check:**
1. Postback URL is correct in network settings
2. API key matches what's saved in dashboard
3. Network is sending postback requests (check network logs)
4. Your server is accessible from the internet

**Test:**
```bash
# Test postback endpoint is accessible
curl "https://yourdomain.com/api/postback?network=clickdealer&api_key=YOUR_API_KEY&external_id=TEST&subid=test&revenue=1&country=US&status=approved"
```

### Invalid API Key Error

**Solution:**
1. Verify API key in dashboard matches network's API key
2. Check API key hasn't expired
3. Regenerate API key in network if needed

### Duplicate Conversions

**Note:** The postback endpoint is idempotent - if the same `external_id` is received twice, it won't create duplicate leads.

### Conversion Status

By default, all conversions are marked as `approved`. You can extend this to support:
- `pending` - Conversion under review
- `rejected` - Conversion declined
- `approved` - Conversion accepted

## Security Best Practices

1. **Keep API Keys Secret**
   - Never commit API keys to version control
   - Use environment variables for production
   - Rotate API keys regularly

2. **Use HTTPS**
   - Always use HTTPS for postback URLs in production
   - Ensures data is encrypted in transit

3. **Validate Parameters**
   - Implement additional validation if needed
   - Check for suspicious conversion patterns

4. **Monitor Logs**
   - Regularly review conversion logs
   - Set up alerts for unusual activity

5. **Rate Limiting**
   - Consider implementing rate limiting on postback endpoint
   - Prevent abuse or spam requests

## Advanced Features

### Custom Networks

To add a new network:

1. Add to `NETWORKS` array in `/settings/page.tsx`:

```typescript
{
  value: 'new_network',
  label: 'New Network Name',
  description: 'Brief description',
  docsUrl: 'https://newnetwork.com/docs',
  postbackFormat: 'payout={revenue}&offer_id={external_id}&subid={subid}',
}
```

2. Network will automatically appear in dropdown

### Webhook Integration

For advanced use cases, extend the postback endpoint to:
- Send notifications to Slack/Discord
- Update external databases
- Trigger custom workflows
- Send confirmation emails

### Multi-Tier Tracking

Track conversions at different levels:

- **Publisher Level:** Main account
- **Affiliate Level:** Sub-affiliate accounts
- **Campaign Level:** Individual campaigns
- **Creative Level:** Specific banners/ads

## Support

For issues or questions:
- Check **Documentation** tab in Settings
- Review network's API documentation
- Test postback endpoint manually
- Check server logs for errors

---

**Ready to integrate?** Go to **Settings → Networks** to add your first CPA network!
