<html>

    <head>
        <title>Apollo Planner - My Account</title>
        <link rel="shortcut icon" href="images/logo.ico">

        <!--CSS-->
        <link rel="stylesheet" type="text/css" href="./css_styles/myaccount_styles.css">

        <script>
            //Underlining
            function underline(item) {
                $(item).css("textDecoration", "underline");
            }

            function de_underline(item) {
                $(item).css("textDecoration", "none");
            }
            //scroll back to top
            function scrollToTop()
            {
                $("html, body").animate({scrollTop: 0}, 200);
                return false;
            }
        </script>
    </head>

    <body bgcolor="#E0E0E0">
        <div id="center_body">
            <!-- Top Bar -->
            <div id="top_bar">
                <!-- Logo -->
                <div id="sunset_logo">
                    <img src="./images/sunset_logo.png" alt="Sunset Logo" width="55" height="55"/>
                </div>
                <!-- name -->
                <div id="apollo_name">
                    <h1>
                        Apollo Planner
                    </h1>
                </div>
                <!--Click to go home-->
                <div onclick="window.location = './home.php';" style="position:absolute;left:0px;top:0px;bottom:0px;width:280px;cursor:pointer;" title="Click to return home">

                </div>
            </div>

            <!-- Footer bar -->
            <div id="footer">
                <div style="position:absolute;left:5px;line-height:0px;width:200px;height:20px;top:-2px;">
                    <p class="footer_font" id="scroll_top" onclick="scrollToTop();" onmouseover="underline(this);" onmouseout="de_underline(this);">
                        Scroll to top &uarr;
                    </p>
                </div>
                <div style='position:absolute;left:390px;line-height:0px;width:200px;height:20px;top:-2px;'>
                    <p class="footer_font" id="help" onmouseover="underline(this);" onmouseout="de_underline(this);">
                        Help
                    </p>
                </div>
                <div style='position:absolute;right:0px;line-height:0px;width:115px;height:20px;top:-2px;'>
                    <p class="footer_font" id="contact_webmaster" onmouseover="underline(this);" onmouseout="de_underline(this);">
                        Contact Webmaster
                    </p>
                </div>
            </div>

            <!--Main content-->
            <div style="position:absolute;left:10px;top:60px;height:10px;width:780px;">
                <h1 style="font-size:20px;">Welcome to Apollo Planner 1.0.0.0 beta</h1>
                <p class='regular_font'>Please notify elijah.carbonaro@gmail.com of all bugs/feature requests.</p>
                <p class='title_font'>What is is?</p>
                <p class='regular_font'>Apollo Planner is a new system designed to help communication between students and teachers. This is done by teachers creating account, then creating "Classes" and "Feeds". Students can then go and subscribe to classes and feeds they would like to receive homework/announcement notifications from.</p>
                <p class='title_font'>I want to help!</p>
                <p class='regular_font'>Apollo Planner has been written so far exclusively by me, Elijah. However, I am graduating this year and need someone to continue on with my work. If you find Apollo Planner interesting, would like to learn more about it, or want to help, contact the email address above or speak to Mr. Galbraith in 1-20. Prerequisites for helping would be HTML, JavaScript, PHP, CSS, and XML experience (iOS and Android experience is welcomed, too).</p>
                <p class='title_font'>Classes</p>
                <p class="regular_font">Classes are designed for teachers to use as, you guess it, classes. They allow a teacher to post homework and for students to easily see their latest homework assignments from the home page.</p>
                <p class="title_font">Feeds</p>
                <p class="regular_font">Feeds are designed to be used by clubs. They allow the teachers/club leaders to communicate with members important announcements such as meetings or other urgent information.</p>
                <p class="title_font">For Teachers</p>
                <p class="regular_font">How can teachers benefit from this? Many of you already post your homework on the web, which makes it much easier for students to get all their homework done. However, you all do it in a unique way. Apollo Planner standardizes assignment input so that students can see ALL their homework all in one place, making it much easier for them. Entering assignments is very easy and painless, and using Apollo Planner should reduce the time it takes you to enter assignments. Additionally, you don't even have to do it yourself! Using the contributor system (mentioned later), allows you to let your student aid or others enter the information for you, meaning you do not even have to interact with Apollo Planner at all!</p>
                <p class="title_font">For Students</p>
                <p class='regular_font'>Most of your homework is posted online by teachers already, but what if it were all in one place? Look no further than Apollo Planner. Your homepage pulls all the latest assignments from all you classes, making your once long process of finding each teachers' site a breeze! If you are head of a club or sports team, you can also be given permission to post things and communicate with you members or teammates! (For more info, see the contributor system). Future updates will allow you to access homework on your Android or iOS device and receive live updates from feeds!</p>
                <p class='title_font'>Contributor System</p>
                <p class='regular_font'>The contributor system allows teachers to create a class or feed and then give a student "contributor" permission. This means that the student can create new posts or homework assignments or edit existing ones. This is great for teachers with student aids who they want to enter the homework on the web, or for teachers who supervise a club and can give the student leaders access to the club's feed.</p>
                <p class='title_font'>Beta means beta, very very beta</p>
                <p class='regular_font'>See the Beta up there? It's not a lie. Apollo Planner is still under a lot of development and likely has lots of bugs. Please report any bugs, big or small, to the email address listed at the top of this page.</p>
                <p class='title_font'>What's next?</p>
                <p class='regular_font'>As Apollo Planner continues to be upgraded, more features are sure to come. Android and iOS applications are on the way to enable students to access their homework on the go, or be live-updated when someone posts an announcement to a feed.</p>
                <p class='title_font'>Known Bugs</p>
                <p class='regular_font'>Please do not contact me based off of these already known bugs:</p>
                <ul class='regular_font'>
                    <li>Input validation</li>
                    <li>File Uploading System</li>
                    <li>Website icons acting weird</li>
                    <li>Deleting an account</li>
                    <li>Strange auto-fill behavior</li>
                    <li>"Contact Webmaster" link not working (it shouldn't)</li>                    
                </ul>
            </div>

        </div>
    </body>

</html>