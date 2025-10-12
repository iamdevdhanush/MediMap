  # ![MediMap Logo](https://via.placeholder.com/50) MediMap

**Real-Time Community Healthcare Resource Tracker | 100% Free | Fully Responsive**

---

## 🚀 Overview
MediMap is a **community-driven platform** for finding and sharing **healthcare resources** like blood banks, oxygen, medicines, ICU beds, and vaccination centers.  

- Fully **digital & free**  
- **AI-verified** posts for authenticity  
- **Responsive** on mobile, tablet, and desktop  
- Gamified **Credibility Points & Leaderboard**  

---

## 🌟 Features

- **Real-Time Resource Tracking** – Find nearby hospitals, blood banks, oxygen cylinders, medicines, and ICU beds  
- **AI Verification & Categorization** – Ensures accuracy of posts  
- **Community Contributions & Alerts** – Users can post and confirm resource availability  
- **Leaderboard & Gamification** – Credibility points encourage participation  
- **Responsive UI** – Works seamlessly across all devices  
- **Zero Cost** – Built completely free using Lovable AI  

---

## 📱 Pages / Screens

| Page | Purpose |
|------|---------|
| **Home Feed / Map** | Browse nearby resources dynamically |
| **Post Resource** | Add blood, oxygen, medicine, or bed info |
| **Blood Bank / Emergency** | Specialized listing of critical resources |
| **Profile** | Track contributions & points |
| **Leaderboard** | Top contributors by Credibility Points |

---

## 🛠️ Database Schema

**Users**  
- `id` (string) – Unique user ID  
- `name` (string) – Username  
- `location` (string) – City or Pin code  
- `credibility_points` (integer) – Total points  
- `rank` (integer) – Leaderboard rank  
- `created_at` (datetime)  

**Resources**  
- `id` (string) – Unique resource ID  
- `owner_id` (string) – User posting resource  
- `type` (string) – Blood Bank / Oxygen / Medicine / Bed / Vaccine  
- `name` (string) – Resource name  
- `location` (string) – City / Pin code  
- `quantity` (string) – Availability info  
- `verified` (boolean) – AI verified  
- `last_updated` (datetime)  
- `ai_notes` (text) – AI suggestions / flags  

**Claims**  
- `id` (string) – Claim ID  
- `resource_id` (string) – Linked resource  
- `claimer_id` (string) – User claiming or confirming  
- `status` (string) – Pending / Confirmed  
- `created_at` (datetime)  

---

## 🤖 AI Workflows

1. **AI Verify & Categorize** – Validates posts and assigns category  
2. **Claim Resource Workflow** – Updates availability & awards points  
3. **Leaderboard Update** – Dynamically ranks users  

---

## 🎮 Gamification

- Earn points for posting verified resources, confirming availability, and daily activity streaks  
- Badges: “Life Saver”, “Community Hero”, “Verified Contributor”  

---

## 💻 Tech Stack

- **Lovable AI** – Verification & categorization  
- **Lovable Database** – Stores users, resources, claims, points  
- **Responsive UI** – Works on mobile, tablet, and desktop  

---

## 🚀 How to Use

1. Open MediMap on your device (mobile, tablet, or desktop).  
2. Browse nearby resources via **Home Feed** or **Map View**.  
3. Post a new resource by clicking **“Post Resource”**.  
4. Confirm or claim resources to earn **Credibility Points**.  
5. Check **Leaderboard** to see top contributors.  

---

## 🆓 Cost

| Component | Cost |
|-----------|------|
| Lovable Platform | ✅ Free |
| AI Verification & Categorization | ✅ Free |
| Database | ✅ Free |
| Hosting | ✅ Free |
| APIs | ❌ None |
| **Total** | ₹0 |

---

## 🌍 Impact

- Provides **real-time healthcare info** to communities in need  
- Reduces panic during emergencies  
- Helps low-income populations access **free medical resources**  
- Scales nationwide with zero cost  

---

## 🏷️ Taglines

- “Real-Time Community Healthcare, Free & Verified.”  
- “Find Blood, Oxygen, Medicine, or ICU Beds Instantly.”  
- “MediMap — Saving Lives, One Resource at a Time.”  

---
