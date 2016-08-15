$(document).ready(function () {
    var timerType = "session";

    $("#break-minus-btn").click(function () {
        var val = decrement($("#break-length").text());
        $("#break-length").text(val);
    });

    $("#break-plus-btn").click(function () {
        var val = increment($("#break-length").text());
        $("#break-length").text(val);
    });

    $("#sess-minus-btn").click(function () {
        var val = decrement($("#sess-length").text());
        $("#sess-length").text(val);
        $("#timer-display").text(toHHMMSS(val*60));
        
    });

    $("#sess-plus-btn").click(function () {
        var val = increment($("#sess-length").text());
        $("#sess-length").text(val);
        $("#timer-display").text(toHHMMSS(val*60));
    });

    var isStarted = false;
    var isPaused = false;

    $("#timer").click(function () {
        if (!isStarted) {
            Clock.init(
                parseInt($("#sess-length").text()) * 60,
                $('#timer-display'),
                $('.circle-filler'),
                toggleType);
            Clock.start();
            isStarted = true;
        } else if (!isPaused) {
            Clock.pause();
            isPaused = true;
        } else {
            Clock.resume();
            isPaused = false;
        }
    });

    function toHHMMSS(val) {
        var hh, mm, ss;
        hh = Math.floor(val / 3600);
        mm = Math.floor(val % 3600 / 60);
        ss = parseInt(val % 3600 % 60);

        mm = mm < 10 ? "0" + mm : mm;
        ss = ss < 10 ? "0" + ss : ss;

        if (hh == 0) {
            return mm + ":" + ss;
        } else {
            return hh + ":" + mm + ":" + ss;
        }
    }

    function decrement(val) {
        if (isStarted) return val;
        val = eval(val + "-1");
        if (val < 1) val = 1;
        return val;
    }

    function increment(val) {
        if (isStarted) return val;
        val = eval(val + "+1");
        return val;
    }

    function toggleType() {
        if (timerType == "session") {
            Clock.setDuration(parseInt($("#break-length").text()) * 60);
            Clock.displayFillColor2 = "#ff5252";
            Clock.start();
            $("#timer-title").text("Break");
            timerType = "break";
        } else {
            Clock.setDuration(parseInt($("#sess-length").text()) * 60);
            Clock.displayFillColor2 = "#69F0AE";
            Clock.start();
            $("#timer-title").text("Session");
            timerType = "session";
        }
    }

    var Clock = {
        duration: 0,
        timeLeft: 0,
        display: null,
        callback: null,
        displayFill: null,
        displayFillColor1: "#757575",
        displayFillColor2: "#69F0AE",

        init: function(duration, display, displayFill, callback) {
            this.duration = duration;
            this.timeLeft = duration;
            this.display = display;
            this.callback = callback;
            this.displayFill = displayFill;
        },

        start: function () {
            var self = this;

            this.interval = setInterval(function () {

                if (self.display) {
                    self.display.text(toHHMMSS(self.timeLeft));
                }


                if (self.displayFill) {
                    var percentage_current = Math.round(10000 * self.timeLeft / self.duration) / 100;
                    self.displayFill.css(
                        'background',
                        'linear-gradient('+self.displayFillColor1+' '+percentage_current+'%,'+self.displayFillColor2+' '+percentage_current+'%)'
    );
                }

                if(--self.timeLeft < 0) {
                    $("#bell-ring")[0].play();
                    if (self.callback) {
                        clearInterval(self.interval);
                        self.callback();
                    } else {
                        clearInterval(self.interval);
                    }
                } 

            }, 1000);
        },

        pause: function () {
            clearInterval(this.interval);
            delete this.interval;
        },

        resume: function () {
            if (!this.interval) this.start();
        },

        setDuration: function(duration) {
            this.duration = duration;
            this.timeLeft = duration;
        }

    };

});