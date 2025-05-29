<?php $currentPage = basename($_SERVER['PHP_SELF']); session_start(); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="page-title">Ukhuseleko</title>
    <link rel="stylesheet" href="css/home.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>

    <div id="banner">
        
        <div class="background-image">
            <img src="images/holding_hands.png" alt="Holding Hands Background">
        </div>
        <div class="intro">
            <h1 data-translate="intro-heading">Protection and Support Against Domestic Violence</h1>
            <p data-translate="intro-paragraph">You are not alone. Ukhuseleko provides support, resources, and immediate assistance for those experiencing domestic violence in South Africa.</p>
            <div class="buttons">
                <button type="submit" id="Story" data-translate="btn-find-resources">Find Resources</button>
                <button type="submit" id="Learn" href="share.html" data-translate="btn-get-support">Get Support</button>
            </div>
        </div>
    </div>

    <header>
        

        <nav>
              <ul class="navbar">
                <li><a href="home.php" class="active" data-translate="nav-home">Home</a></li>
                <li><a href="legal.html" data-translate="nav-resources">Resources</a></li>
                <li><a href="support.html" data-translate="nav-support">Support</a></li>
                <li><a href="gbv.html" data-translate="nav-gbv">GBV</a></li>
                <li><a href="finalChat.html" data-translate="nav-safe-haven">Safe Haven</a></li>
                <li><a href="share.html" data-translate="nav-share-story">Share Your Story</a></li>
                <li><a href="Contact.html" data-translate="nav-contact-us">Contact Us</a></li>
  
                <li>
                    <?php if (isset($_SESSION["username"])): ?>
                        <a href="logout.php" data-translate="logout-user">
                            Logout (<?php echo htmlspecialchars($_SESSION["username"]); ?>)
                        </a>
                    <?php else: ?>
                        <a href="login.php" data-translate="login-guest">
                            Login (Guest)
                        </a>
                    <?php endif; ?>
                </li>
            </ul>
        </nav>
    </header>

    <button class="emergency-btn" id="emergencyBtn" data-translate="emergency-help-btn">
        <img src="images/emergency-button.png" alt="Emergency Icon">
        EMERGENCY HELP
    </button>

    <div class="language-selector-fixed">
        <select id="languageSelect" aria-label="Select Language">
            <option value="en">English</option>
            <option value="af">Afrikaans</option>
            <option value="nso">Sepedi</option>
            <option value="st">Sesotho</option>
            <option value="ss">Siswati</option>
            <option value="tn">Setswana</option>
            <option value="ts">Xitsonga</option>
            <option value="ve">Tshivenḓa</option>
            <option value="xh">isiXhosa</option>
            <option value="zu">isiZulu</option>
            <option value="nr">isiNdebele</option>
        </select>
    </div>
    

    <div class="text1">
        <h2 data-translate="how-can-we-help-you-heading">How Can We Help You</h2>
        <p data-translate="how-can-we-help-you-paragraph">Ukhuseleko stands against gender-based violence and are committed to raising awareness, supporting survivors, and driving meaningful change through advocacy and action.</p>
    </div>

    <div class="tips">
        <div class="tips-top">
            <div class="emergency">
                <div class="picture">
                    <img src="images/emergency.png" alt="Emergency">
                        <div class="text">
                            <h2 data-translate="emergency-response-title">Emergency Response</h2>
                            <p data-translate="emergency-response-desc">Quick access to emergency services with our silent reporting system and real-time status updates.</p>
                        </div>
                </div>
            </div>

            <div class="legal" onclick="location.href='legal.html'">
                <div class="picture">
                    <img src="images/legal.png" alt="Legal Information">
                        <div class="text">
                            <h2 data-translate="legal-info-title">Legal Information</h2>
                            <p data-translate="legal-info-desc">Learn about your rights under the Domestic Violence Act and how to obtain protection orders.</p>
                        </div>
                </div>
            </div>

            <div class="support">
                <div class="picture">
                    <img src="images/support.png" alt="Support Network">
                        <div class="text">
                            <h2 data-translate="support-network-title">Support Network</h2>
                            <p data-translate="support-network-desc">Connect with local organizations, shelters, and support groups in your community.</p>
                        </div>
                </div>
            </div>

            <div class="resource">
                <div class="picture">
                    <img src="images/resourse.png" alt="Resource Hub">
                        <div class="text">
                            <h2 data-translate="resource-hub-title">Resource Hub</h2>
                            <p data-translate="resource-hub-desc">Access information about government grants, employment programs, and economic empowerment.</p>
                        </div>
                </div>
            </div>
        </div>
        <div class="tips-bottom">
            <div class="safe-haven" onclick="window.location.href='finalChat.html'">
                <div class="picture">
                    <img src="images/healing2.png" alt="Safe Haven">
                        <div class="text">
                            <h2 data-translate="safe-haven-title">Safe Haven</h2>
                            <p data-translate="safe-haven-desc">Connect with fellow GBV survivors in a safe space designed for support, shared stories, and healing.</p>
                        </div>
                </div>
            </div>

            <div class="share-your-story" onclick="window.location.href='share.html'">
                <div class="picture">
                    <img src="images/share_your_story.png" alt="Share Your Story">
                        <div class="text">
                            <h2 data-translate="share-story-title">Share Your Story</h2>
                            <p data-translate="share-story-desc">Your voice matters — share your journey and let others know they're not alone.</p>
                        </div>
                </div>
            </div>
            <div class="counseling">
                <div class="picture">
                    <img src="images/sitting.png" alt="Counseling">
                        <div class="text">
                            <h2 data-translate="counseling-title">Counseling</h2>
                            <p data-translate="counseling-desc">Access confidential counseling and speak to professionals who are here to support your healing journey.</p>
                        </div>
                </div>
            </div>

            <div class="how-to-get-out">
                <div class="picture">
                    <img src="images/get_out_woman.png" alt="How to Get Out">
                        <div class="text">
                            <h2 data-translate="how-to-get-out-title">How to Get Out</h2>
                            <p data-translate="how-to-get-out-desc">Step-by-step guidance to leave toxic relationships with safety planning, emotional support, and trusted resources.</p>
                        </div>
                </div>
            </div>
        </div>
    </div>

    <br><br><br><br>

    <div class="facts-container">
        <div class="facts-title"><h3 data-translate="facts-heading">Facts about GBVF in South Africa</h3></div>

        <div class="facts-intro">
            <p data-translate="facts-intro-paragraph">Gender-based violence and femicide (GBVF) are deeply entrenched and widespread crises in South Africa. Every day, women and children in both urban and rural communities face unimaginable violence and brutality. The government's failure to take decisive action enables perpetrators to operate with impunity, leaving survivors without justice and communities in fear</p>
        </div>

        <div class="facts">
            <p data-translate="facts-list-intro">The following facts highlight the devastating reality of GBVF in South Africa</p>
            <ul class="facts-list">
                <li data-translate="fact-1">The <span data-translate="fact-1-span-1">rate of femicide in South Africa is 6x higher</span> than the global average, with at least <span data-translate="fact-1-span-2">15 women being murdered every day</span></li>
                <li data-translate="fact-2"><span data-translate="fact-2-span-1">5,578 women were murdered</span> in 2023/24, a 33,8% increase compared to the year before.</li>
                <li data-translate="fact-3"><span data-translate="fact-3-span-1">1,656 children were murdered</span> in 2023/24, a 38,7% increase compared to the year before</li>
                <li data-translate="fact-4"><span data-translate="fact-4-span-1">42,569 rape cases were reported</span> to the police in 2023/24.</li>
                <li data-translate="fact-5">It's estimated that <span data-translate="fact-5-span-1">95% of rape cases are not reported.</span></li>
                <li data-translate="fact-6"><span data-translate="fact-6-span-1">63,054 assaults with intent to inflict bodily harm on women</span> in 2023/24.</li>
            </ul>
        </div>
    </div>

    <div class="footer-container">
            <div class="footer-column">
                <h2 data-translate="footer-about-ukhuseleko">About Ukhuseleko</h2>
                <ul>
                    <li data-translate="footer-mission">Our Mission</li>
                    <li data-translate="footer-team">Team</li>
                    <li data-translate="footer-partners">Partners</li>
                    <li data-translate="footer-testimonials">Testimonials</li>
                </ul>
            </div>

            <div class="footer-column">
                <h2 data-translate="footer-resources">Resources</h2>
                <ul>
                    <li data-translate="footer-safe-haven">Safe Haven</li>
                    <li data-translate="footer-share-story">Share your story</li>
                    <li data-translate="footer-counseling">Councelling</li>
                    <li data-translate="footer-financial-aid">Financial Aid</li>
                </ul>
            </div>

            <div class="footer-column">
                <h2 data-translate="footer-emergency-contacts">Emergency Contacts</h2>
                <ul>
                    <li data-translate="footer-saps">SAPS : 10111</li>
                    <li data-translate="footer-gbv-command">GBV Command Centre : 0800 428 428</li>
                    <li data-translate="footer-ussd">*120*7867# (USSD)</li>
                    <li data-translate="footer-feedback">Feedback</li>
                </ul>
            </div>

            <div class="footer-column">
                <h2 data-translate="footer-legal">Legal</h2>
                <ul>
                    <li data-translate="footer-terms">Terms of service</li>
                    <li data-translate="footer-privacy">Privacy Policy</li>
                    <li data-translate="footer-cookie">Cookie Policy</li>
                    <li data-translate="footer-disclaimer">Disclaimer</li>
                </ul>
            </div>
    </div>

    <script src="../js/script.js"></script>
</body>
</html>