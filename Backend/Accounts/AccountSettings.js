const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const bcrypt = require('bcrypt');

const ProfilePhoto = require('../Middlewares/multerProfilePhoto');

const authenticateToken = require('../Middlewares/auth');
const { UserType } = require('../src/generated/prisma');

router.get('/account-information', authenticateToken, async (req, res) => {
    try {
        const { pwd_id, emp_id, userId, userType } = req.user;

        let profile = null;

        if((!pwd_id && !emp_id) || !userId) {
            return res.status(400).json({ error: "No ID found from this token." });
        }

        if(!userType) {
            return res.status(400).json({ error: "Invalid user type in token." });
        }

        if(userType === "PWD") {
            profile = await prisma.users.findUnique({
                where: { user_id: userId },
                select: {
                    email: true,
                    phone_number: true,
                    pwd_Profile: {
                        select: {
                            profile_picture: true,
                            first_name: true,
                            last_name: true,
                            profile_visibility: true,
                            show_email: true,
                            show_phone_number: true,
                            show_location: true,
                            allow_messages: true,
                            show_online_status: true,
                            email_job_matches: true,
                            messages: true,
                            application_updates: true,
                            email_profile_views: true,
                            weekly_digest: true,
                            marketing_emails: true,
                            push_notif_job_matches: true,
                            push_notif_messages: true,
                            push_notif_application_updates: true,
                            push_notif_profile_views: true,
                            urgent_messages: true,
                            security_alerts: true,
                        }
                    }
                }
            });

            if(!profile) {
                return res.status(404).json({ error: "PWD not found." });
            }

            return res.json({
                success: true,
                data: {
                    profile_picture: profile.pwd_Profile?.profile_picture
                    ? `http://localhost:4000/uploads/PWDs/${userId}/${profile.pwd_Profile?.profile_picture}`
                    : null,
                    firstname: profile.pwd_Profile?.first_name,
                    lastname: profile.pwd_Profile?.last_name,
                    email: profile.email,
                    phone: profile.phone_number,
                    profile_visibility: profile.pwd_Profile?.profile_visibility,
                    show_email: profile.pwd_Profile?.show_email,
                    show_phone_number: profile.pwd_Profile?.show_phone_number,
                    show_location: profile.pwd_Profile?.show_location,
                    allow_messages: profile.pwd_Profile?.allow_messages,
                    show_online_status: profile.pwd_Profile?.show_online_status,
                    job_matches: profile.pwd_Profile?.job_matches,
                    messages: profile.pwd_Profile?.messages,
                    application_updates: profile.pwd_Profile?.application_updates,
                    email_profile_views: profile.pwd_Profile?.email_profile_views,
                    weekly_digest: profile.pwd_Profile?.weekly_digest,
                    marketing_emails: profile.pwd_Profile?.marketing_emails,
                    push_notif_job_matches: profile.pwd_Profile?.push_notif_job_matches,
                    push_notif_messages: profile.pwd_Profile?.push_notif_messages,
                    push_notif_application_updates: profile.pwd_Profile?.push_notif_application_updates,
                    push_notif_profile_views: profile.pwd_Profile?.push_notif_profile_views,
                    urgent_messages: profile.pwd_Profile?.urgent_messages,
                    security_alerts: profile.pwd_Profile?.security_alerts,
                }
            });
        } else { // Fetch Employer profile
            profile = await prisma.users.findUnique({
                where: { user_id: userId },
                include: {
                    employer_Profile: {
                        include: {
                            
                        }
                    }
                }
            });

            if(!profile) {
                return res.status(404).json({ error: "PWD not found." });
            }

            return res.json({
                success: true,
                data: {

                }
            });
        }
    } catch(error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: 'Internal Server error', error: "Failed to fetch user account." });
    }
});

//UPDATE PASSSWORD
router.put('/update-password', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: { password_hash: true }
        });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) return res.status(400).json({ success: false, message: 'Current password incorrect' });

        const saltRounds = 10;
        const newHash = await bcrypt.hash(newPassword, saltRounds);

        await prisma.users.update({
            where: { user_id: userId },
            data: { password_hash: newHash }
        });

        return res.json({ success: true, message: 'Password updated' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { userId, userType, pwd_id, emp_id } = req.user; 
    const { section, data } = req.body;

    let updated;

    if (userType === "PWD") {
        // PWD profile update
        if (section === "account") {
            updated = await prisma.pwd_Profile.update({
            where: { pwd_id: pwd_id },
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
                profile_picture: data.profilePicture,
                user: {
                    update: {
                        email: data.email,
                        phone_number: data.phone,
                    }
                }
            },
            include: { user: true }
            });
        }

        if (section === "privacy") {
            updated = await prisma.pwd_Profile.update({
            where: { pwd_id: pwd_id },
            data: {
                profile_visibility: data.profileVisibility,
                show_email: data.showEmail,
                show_phone_number: data.showPhone,
                show_location: data.showLocation,
                allow_messages: data.allowMessages,
                show_online_status: data.showOnlineStatus
            }
            });
        }

        if (section === "notifications") {
            updated = await prisma.pwd_Profile.update({
            where: { pwd_id: pwd_id },
            data: {
                job_matches: data.email.jobMatches,
                messages: data.email.messages,
                application_updates: data.email.applications,
                email_profile_views: data.email.profileViews,
                weekly_digest: data.email.weeklyDigest,
                marketing_emails: data.email.marketing,

                push_notif_job_matches: data.push.jobMatches,
                push_notif_messages: data.push.messages,
                push_notif_application_updates: data.push.applications,
                push_notif_profile_views: data.push.profileViews,

                urgent_messages: data.sms.urgentMessages,
                security_alerts: data.sms.securityAlerts
            }
            });
        }

        if (section === "security") {
            updated = await prisma.pwd_Profile.update({
            where: { pwd_id: pwd_id },
            data: {
                two_factor_auth: data.twoFactorAuth,
                login_alerts: data.loginAlerts,
                session_timeout: data.sessionTimeout
            }
            });
        }
    } else if (userType === "Employer") {
        // UPDATE EMLOYER DATA
    }

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ success: false, error: "Failed to update account" });
  }
});

router.put('/update-profile-picture', authenticateToken, ProfilePhoto, async (req, res) => {
    try {
        const { pwd_id, emp_id, userType } = req.user;
        const profilePhoto = req.files?.profilePhoto?.[0] || null;

        if(!profilePhoto) {
            return res.json({ success: true, message: "No profile photo uploaded." });
        }

        let updatePhoto;
        if(userType === "PWD") {
            updatePhoto = await prisma.pwd_Profile.update({
                where: { pwd_id },
                data: { profile_picture: profilePhoto ? profilePhoto.filename : null }
            })
        } else if(userType === "Employer") {
            updatePhoto = await prisma.employer_Profile.update({
                where: { employer_id: emp_id },
                data: { profile_picture: profilePhoto ? profilePhoto.filename : null }
            })
        }
        
        return res.json({ success: true, message: "Profile photo updated successfully.", data: { filename: profilePhoto.filename } });
    } catch(error) {
        console.error("Update error:", err);
        return res.status(500).json({ success: false, error: "Failed to update account" });
    }
});

module.exports = router;