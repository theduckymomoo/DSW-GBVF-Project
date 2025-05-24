<?php
session_start();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ukhuseleko</title>
    <link rel="stylesheet" href="css/styles.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>

    <button class="emergency-btn" id="emergencyBtn">
        <img src="images/emergency-button.png" alt="Emergency Icon">
        EMERGENCY HELP
    </button>
    <header>
        <div class="logo">
            <img src="images/logo-swap-removebg.png" alt="Logo">
        </div>
        
        <nav>
            <ul>
                <li><a href="home.php">Home</a></li>
                <li><a href="legal.html">Resources</a></li>
                <li><a href="">Support</a></li>
                <li><a href="gbv.html">GBV</a></li>
                <li><a href="finalChat.html" class="active">Safe Haven</a></li>
                <li><a href="share.html">Share Your Story</a></li>
                <li><a href="Contact.html">Contact Us</a></li>
                <li>
                 
                    <?php if (isset($_SESSION["username"])): ?>
                        <a href="logout.php">
                            Logout (<?php echo htmlspecialchars($_SESSION["username"]); ?>)
                        </a>
                    <?php else: ?>
                        <a href="login.php">
                            Login (Guest)
                        </a>
                    <?php endif; ?>

                </li>  
            </ul>
        </nav>
        
       
    </header>

    <div class="intro">
            <h1>Protection and Support Against Domestic Violence</h1>
            <p>You are not alone. Ukhuseleko provides support, resources, and immediate assistance for those experiencing domestic violence in South Africa.</p>
            <div class="buttons">
                <button type="submit" id="Story">Find Resources</button>
                <button type="submit" id="Learn" href="share.html">Get Support</button>
            </div>
    </div>

    <div class="text1">
        <h2>How Can We Help You</h2>
        <p>Ukhuseleko stands against gender-based violence and are committed to raising awareness, supporting survivors, and driving meaningful change through advocacy and action.</p>   
    </div>

    <div class="tips">
        <div class="tips-top">
            <div class="emergency">
                <div class="picture">
                    <img src="images/emergency.png">
                        <div class="text">
                            <h2>Emergency Response</h2>
                            <p>Quick access to emergency services with our silent reporting system and real-time status updates.</p>
                        </div>
                </div>
            </div>

            <div class="legal" onclick="location.href='legal.html'">
                <div class="picture">
                    <img src="images/legal.png">
                        <div class="text">
                            <h2>Legal Information</h2>
                            <p>Learn about your rights under the Domestic Violence Act and how to obtain protection orders.</p>
                        </div>
                </div>
            </div>

            <div class="support">
                <div class="picture">
                    <img src="images/support.png">
                        <div class="text">
                            <h2>Support Network</h2>
                            <p>Connect with local organizations, shelters, and support groups in your community.</p>
                        </div>
                </div>
            </div>

            <div class="resource">
                <div class="picture">
                    <img src="images/resourse.png">
                        <div class="text">
                            <h2>Resource Hub</h2>
                            <p>Access information about government grants, employment programs, and economic empowerment.</p>
                        </div>
                </div>
            </div>
        </div>
        <div class="tips-bottom">
            <div class="safe-haven" onclick="window.location.href='finalChat.html'">
                <div class="picture">
                    <img src="images/healing2.png">
                        <div class="text">
                            <h2>Safe Haven</h2>
                            <p>Connect with fellow GBV survivors in a safe space designed for support, shared stories, and healing.</p>
                        </div>
                </div>
            </div>

            <div class="share-your-story" onclick="window.location.href='share.html'">
                <div class="picture">
                    <img src="images/share_your_story.png">
                        <div class="text">
                            <h2>Share Your Story</h2>
                            <p>Your voice matters — share your journey and let others know they're not alone.</p>
                        </div>
                </div>
            </div>
            <div class="counseling">
                <div class="picture">
                    <img src="images/sitting.png">
                        <div class="text">
                            <h2>Counseling</h2>
                            <p>Access confidential counseling and speak to professionals who are here to support your healing journey.</p>
                        </div>
                </div>
            </div>

            <div class="how-to-get-out">
                <div class="picture">
                    <img src="images/get_out_woman.png">
                        <div class="text">
                            <h2>How to Get Out</h2>
                            <p>Step-by-step guidance to leave toxic relationships with safety planning, emotional support, and trusted resources.</p>
                        </div>
                </div>
            </div>
        </div>
    </div>
    
    <br><br><br><br>
    
    <div class="facts-container">
        <div class="facts-title"><h3>Facts about GBVF in South Africa</h3></div>

        <div class="facts-intro">
            <p>Gender-based violence and femicide (GBVF) are deeply entrenched and widespread crises in South Africa. Every day, women and children in both urban and rural communities face unimaginable violence and brutality. The government's failure to take decisive action enables perpetrators to operate with impunity, leaving survivors without justice and communities in fear</p>
        </div>

        <div class="facts">
            <p>The following facts highlight the devastating reality of GBVF in South Africa</p>
            <ul class="facts-list">
                <li>The <span>rate of femicide in South Africa is 6x higher</span> than the global average, with at least <span>15 women being murdered every day</span></li>
                <li><span>5,578 women were murdered</span> in 2023/24, a 33,8% increase compared to the year before.</li>
                <li><span>1,656 children were murdered</span> in 2023/24, a 38,7% increase compared to the year before</li>
                <li><span>42,569 rape cases were reported</span> to the police in 2023/24.</li>
                <li>It's estimated that <span>95% of rape cases are not reported.</span></li>
                <li><span>63,054 assaults with intent to inflict bodily harm on women</span> in 2023/24.</li>
            </ul>
        </div>
    </div>

    <div class="footer-container">
            <div class="footer-column">
                <h2>About Ukhuseleko</h2>
                <ul>
                    <li>Our Mission</li>
                    <li>Team</li>
                    <li>Partners</li>
                    <li>Testimonials</li>
                </ul>
            </div>
    
            <div class="footer-column">
                <h2>Resources</h2>
                <ul>
                    <li>Safe Haven</li>
                    <li>Share your story</li>
                    <li>Councelling</li>
                    <li>Financial Aid</li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h2>Emergency Contacts</h2>
                <ul>
                    <li>SAPS : 10111</li>
                    <li>GBV Command Centre : 0800 428 428</li>
                    <li>*120*7867# (USSD)</li>
                    <li>Feedback</li>
                </ul>
            </div>
    
            <div class="footer-column">
                <h2>Legal</h2>
                <ul>
                    <li>Terms of service</li>
                    <li>Privacy Policy</li>
                    <li>Cookie Policy</li>
                    <li>Disclaimer</li>
                </ul>
            </div>
    </div>

    <script src="../js/script.js"></script>
</body>
</html>