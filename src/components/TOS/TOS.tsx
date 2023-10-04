// Header component

import './TOS.css';

const paymentProcessor = "Shopify";
const contactInfo = "Contact Info"

function TOS() {
    return (
        <div id="tos">
            <h2>Terms & Conditions</h2>
            <div className='tos-body'>
                <h5>1. Introduction</h5>
                <li>
                    1.1. Welcome to e360cloud.io (the "Website"). These terms and conditions ("Terms") govern your use of the Website. By accessing or using the Website, you agree to be bound by these Terms. If you do not agree to these Terms, please refrain from using the Website.
                </li>
                <br />
                <h5>2. Use of the Website</h5>
                <li>
                    2.1. You must be at least 16 years of age to use this Website. By using the Website, you represent and warrant that you are of legal age to form a binding contract.
                </li>
                <li>
                    2.2. You agree to use the Website in compliance with all applicable laws, regulations, and these Terms.
                </li>
                <br />
                <h5>3. Billing Terms</h5>
                <li>3.1. If you make a purchase through the Website, you agree to pay all fees and charges associated with that purchase. The Landing Zone setup fee will be clearly stated before you make the purchase. Your Landing Zone will include services and components from the specific Hyperscaler selected and these consumption costs are billed on a monthly basis. You agree to pay all incurred charges associated your account's service and product consumption monthly according to the billing statement.
                </li>
                <li>3.2. All payments are processed securely through {paymentProcessor}. We do not store your payment information.
                </li>
                <li>3.3. If you provide payment information, you represent and warrant that the information is accurate, and you have the right to use the payment method provided.
                </li>
                <br />
                <h5>4. Indemnification</h5>
                <li>
                    4.1. You agree to indemnify and hold [Your Company Name] and its affiliates, officers, directors, employees, and agents harmless from any claims, demands, losses, liabilities, and expenses (including attorneys' fees) arising out of or in connection with your use of the Website, violation of these Terms, or violation of any third-party rights.
                </li>
                <br />
                <h5>5. Intellectual Property</h5>
                <li>5.1. All content on the Website, including text, graphics, logos, images, and software, is the property of [Your Company Name] or its licensors and is protected by intellectual property laws.
                </li>
                <li>5.2. You may not reproduce, modify, distribute, or publicly display any content from the Website without the prior written consent of [e360].
                </li>
                <br />
                <h5>6. Termination</h5>
                <li>
                    6.1. We reserve the right to terminate or suspend your access to the Website at our discretion, without notice, for any violation of these Terms or for any other reason.
                </li>
                <br />
                <h5>7. Disclaimer</h5>
                <li>
                    7.1. The Website is provided "as is" and without warranties of any kind, either express or implied. We do not guarantee that the Website will be error-free or continuously available.
                </li>
                <br />
                <h5>8. Limitation of Liability</h5>
                <li>
                    8.1. [e360] shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of the Website.
                </li>
                <br />
                <h5>9. Governing Law</h5>
                <li>
                    9.1. These Terms are governed by and construed in accordance with the laws of California.
                </li>
                <br />
                <h5>10. Changes to Terms</h5>
                <li>
                    10.1. We reserve the right to update or modify these Terms at any time without prior notice. You are responsible for regularly reviewing these Terms.
                </li>
                <br />
                <h5>11. Contact Information</h5>
                <li>
                    11.1. If you have any questions or concerns about these Terms, please contact us at {contactInfo}.
                </li>
                <br />
                <p>By using the Website, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</p>
            </div>
        </div>
    );
}

export default TOS;