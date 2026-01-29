import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';

type PoliciesProps = {
  theme: ThemePalette;
  onBack: () => void;
};

type PolicyItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  content: string;
  lastUpdated: string;
};

const Policies: React.FC<PoliciesProps> = ({ theme, onBack }) => {
  const { mode } = useThemeContext();
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);

  const policies: PolicyItem[] = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How we collect, use, and protect your data',
      icon: 'shield-account',
      color: theme.accent,
      content: `
Privacy Policy for HelloDoctor

Last Updated: December 29, 2024

1. Information We Collect
• Personal Information: Name, email, phone number, age, gender
• Medical Information: Medical history, prescriptions, lab reports
• Usage Data: App usage patterns, feature interactions
• Device Information: Device type, operating system, IP address

2. How We Use Your Information
• To provide medical consultations and services
• To manage appointments and prescriptions
• To send medication reminders
• To improve our services and user experience
• To communicate important updates

3. Data Protection
• All data is encrypted using industry-standard SSL encryption
• Medical records stored in secure, HIPAA-compliant servers
• Regular security audits and vulnerability assessments
• Limited access to authorized medical personnel only

4. Sharing Your Information
• We do not sell your personal information
• Information shared only with:
  - Healthcare providers for treatment
  - Pharmacies for prescription fulfillment
  - Emergency services when required
  - Legal authorities when required by law

5. Your Rights
• Access to your personal and medical information
• Correct inaccurate or incomplete information
• Delete your account and associated data
• Opt-out of non-essential communications
• Control data sharing preferences

6. Data Retention
• Medical records retained for 7 years as required by law
• Account deletion removes all personal data within 30 days
• Anonymous usage data retained for service improvement

Contact us at privacy@hellodoctor.com for privacy concerns.
      `.trim(),
      lastUpdated: 'December 29, 2024',
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      subtitle: 'Rules and guidelines for using HelloDoctor',
      icon: 'file-document-outline',
      color: theme.success,
      content: `
Terms & Conditions for HelloDoctor

Last Updated: December 29, 2024

1. Acceptance of Terms
• By using HelloDoctor, you agree to these terms
• Continued use constitutes acceptance of any updates
• If you disagree, please discontinue using our services

2. Service Description
• HelloDoctor provides telemedicine consultation services
• Prescription management and medication reminders
• Lab report storage and sharing
• Connection with licensed healthcare providers

3. User Responsibilities
• Provide accurate and complete medical information
• Follow prescribed treatment plans
• Maintain confidentiality of account credentials
• Use services for legitimate medical purposes only
• Respect healthcare providers' time and expertise

4. Prohibited Activities
• Sharing account credentials with others
• Using services for illegal purposes
• Submitting false or misleading information
• Harassing or abusing healthcare providers
• Attempting to bypass security measures

5. Medical Consultations
• Consultations are for informational purposes only
• Not a substitute for emergency medical care
• Providers may refuse service if inappropriate
• Prescription at provider's discretion

6. Payment and Billing
• Consultation fees clearly displayed before booking
• Payment required before service delivery
• Refund policy applies as per service terms
• No hidden charges or surprise billing

7. Intellectual Property
• HelloDoctor owns all app content and features
• Users retain rights to their personal medical data
• No license to use HelloDoctor's proprietary technology

8. Limitation of Liability
• HelloDoctor is not liable for medical outcomes
• Not responsible for provider decisions or actions
• Maximum liability limited to service fees paid
• No warranty for uninterrupted service availability

9. Termination
• Users may terminate account at any time
• HelloDoctor may terminate for violations
• Data retention policy applies after termination
• Outstanding fees must be paid

For questions, contact legal@hellodoctor.com
      `.trim(),
      lastUpdated: 'December 29, 2024',
    },
    {
      id: 'telemedicine',
      title: 'Telemedicine Consent',
      subtitle: 'Consent for virtual medical consultations',
      icon: 'video',
      color: theme.warning,
      content: `
Telemedicine Consent Form

Last Updated: December 29, 2024

1. Understanding Telemedicine
• Telemedicine involves virtual medical consultations
• Communication via video, audio, or messaging
• Not suitable for all medical conditions
• May have limitations compared to in-person visits

2. Consent to Treatment
• I consent to receive medical care via telemedicine
• I understand telemedicine has benefits and limitations
• I consent to appropriate treatment recommendations
• I understand prescription decisions are at provider's discretion

3. Technical Requirements
• I have necessary equipment (camera, microphone, internet)
• I will ensure private, well-lit consultation space
• I will test technical setup before appointments
• I understand technical issues may affect consultation quality

4. Privacy and Confidentiality
• I consent to recording consultations for quality purposes
• I understand standard privacy protections apply
• I will ensure no unauthorized persons are present
• I will maintain confidentiality of the consultation

5. Emergency Situations
• I understand telemedicine is not for emergencies
• I will call emergency services (108) for life-threatening conditions
• I will inform providers of any emergency symptoms
• I understand providers may recommend in-person care

6. Limitations
• I understand telemedicine may not allow:
  - Physical examinations
  - Certain diagnostic procedures
  - Emergency medical interventions
  - Complex medical procedures

7. Data and Records
• I consent to electronic storage of consultation records
• I understand standard medical record retention applies
• I consent to sharing records with my primary care provider
• I can request copies of my telemedicine records

8. Responsibilities
• I will provide accurate medical history
• I will follow treatment plans as prescribed
• I will inform providers of medication changes
• I will prepare questions before consultations

By proceeding with telemedicine consultations, I confirm understanding and agreement to these terms.

For telemedicine support: telemedicine@hellodoctor.com
      `.trim(),
      lastUpdated: 'December 29, 2024',
    },
    {
      id: 'data-usage',
      title: 'Data Usage Policy',
      subtitle: 'How we handle and protect your medical data',
      icon: 'database',
      color: theme.textSecondary,
      content: `
Data Usage Policy for HelloDoctor

Last Updated: December 29, 2024

1. Data Collection Principles
• Minimal data collection - only what's necessary
• Transparent data practices - clear explanations
• Secure storage - encryption and access controls
• Purpose limitation - specific, legitimate uses only

2. Data Categories
Personal Data:
• Name, contact information, demographic details
• Account credentials and preferences
• Communication preferences

Medical Data:
• Consultation records and treatment history
• Prescriptions and medication information
• Lab reports and diagnostic results
• Allergy and condition information

Technical Data:
• Device information and app usage patterns
• Performance data and crash reports
• Network and connection information
• Location data (when enabled)

3. Data Processing
• Automated processing for service delivery
• Human review only when necessary
• AI/ML for service improvement (opt-out available)
• Regular data quality checks and validation

4. Data Storage
• Cloud-based storage with redundancy
• Geographic distribution for reliability
• Regular backups and disaster recovery
• Secure deletion when no longer needed

5. Data Security Measures
Encryption:
• End-to-end encryption for communications
• AES-256 encryption for stored data
• SSL/TLS for data transmission
• Regular encryption key rotation

Access Controls:
• Multi-factor authentication for access
• Role-based access for staff
• Audit logging for all data access
• Regular access review and cleanup

Infrastructure Security:
• Secure data centers with physical security
• Network firewalls and intrusion detection
• Regular security penetration testing
• Compliance with healthcare security standards

6. Data Sharing Practices
• Only share with explicit consent
• Minimum necessary data principle
• Secure transmission methods
• Data processing agreements with partners

7. User Control
• Access to all personal data
• Correction of inaccurate information
• Data portability in standard formats
• Deletion requests honored promptly

8. Compliance and Standards
• HIPAA compliance for US users
• GDPR compliance for EU users
• Regular compliance audits
• Updated for changing regulations

9. Data Retention
• Medical data: 7 years (legal requirement)
• Account data: Until account deletion
• Usage analytics: 24 months anonymized
• Backup data: 90 days unless required longer

For data-related inquiries: dpo@hellodoctor.com
      `.trim(),
      lastUpdated: 'December 29, 2024',
    },
  ];

  const handlePolicyPress = (policy: PolicyItem) => {
    setSelectedPolicy(policy);
  };

  const handleBack = () => {
    if (selectedPolicy) {
      setSelectedPolicy(null);
    } else {
      onBack();
    }
  };

  const renderPolicyItem = (policy: PolicyItem) => (
    <TouchableOpacity
      key={policy.id}
      style={[
        styles.policyItem,
        { backgroundColor: theme.card, borderColor: theme.border }
      ]}
      onPress={() => handlePolicyPress(policy)}
    >
      <View style={styles.policyContent}>
        <View style={[styles.iconContainer, { backgroundColor: policy.color + '15' }]}>
          <Icon name={policy.icon} size={24} color={policy.color} />
        </View>
        <View style={styles.policyText}>
          <Text style={[styles.policyTitle, { color: theme.textPrimary }]}>
            {policy.title}
          </Text>
          <Text style={[styles.policySubtitle, { color: theme.textSecondary }]}>
            {policy.subtitle}
          </Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
            Last updated: {policy.lastUpdated}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  if (selectedPolicy) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.navbar, { backgroundColor: theme.background }]}>
          <View style={styles.navLeft}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={22} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.navTitle, { color: theme.textPrimary }]}>
              {selectedPolicy.title}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: theme.accent }]}
            onPress={() => {
              Alert.alert(
                'Download Policy',
                `Downloading ${selectedPolicy.title}...`,
                [
                  { text: 'OK', onPress: () => console.log(`Download: ${selectedPolicy.id}`) }
                ]
              );
            }}
          >
            <Icon name="download" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.policyHeader, { backgroundColor: theme.card }]}>
            <View style={[styles.iconContainer, { backgroundColor: selectedPolicy.color + '15' }]}>
              <Icon name={selectedPolicy.icon} size={32} color={selectedPolicy.color} />
            </View>
            <View style={styles.policyHeaderText}>
              <Text style={[styles.policyTitle, { color: theme.textPrimary }]}>
                {selectedPolicy.title}
              </Text>
              <Text style={[styles.policySubtitle, { color: theme.textSecondary }]}>
                {selectedPolicy.subtitle}
              </Text>
              <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
                Last updated: {selectedPolicy.lastUpdated}
              </Text>
            </View>
          </View>

          <View style={[styles.policyContentView, { backgroundColor: theme.card }]}>
            <Text style={[styles.contentText, { color: theme.textPrimary }]}>
              {selectedPolicy.content}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.navbar, { backgroundColor: theme.background }]}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>
            Policies
          </Text>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.accent }]}>
            <Icon name="download" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Legal & Policy Documents
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Read our policies to understand your rights and responsibilities
          </Text>
        </View>

        <View style={styles.policiesSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Policy Documents
          </Text>
          {policies.map(renderPolicyItem)}
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Need Help?
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color={theme.accent} />
              <Text style={[styles.infoText, { color: theme.textPrimary }]}>
                legal@hellodoctor.com
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color={theme.accent} />
              <Text style={[styles.infoText, { color: theme.textPrimary }]}>
                1800-123-4567
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  policiesSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  policyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyText: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  policySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  policyHeaderText: {
    flex: 1,
  },
  policyContentView: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoSection: {
    gap: 16,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Policies;
