// fixtures.js
module.exports = {
    auth: {
      username: "Stas",
      password: "1234"
    },
    
    booking: {
      fromCity: "Минск",
      toCity: "Гудогай",
      expectedTime: "18:14"
    },
    
    schedule: {
      fromCity: "Минск",
      toCity: "Гудогай"
    },
    
    form: {
      firstName: "Stas",
      lastName: "Rozel",
      phoneNumber: "5873492845"
    },
    
    driver_firefox: {
      browser: "firefox",
      args: ["-headless"],
      extensions: ["adguardadblocker@adguard.com.xpi"],
    },

    driver_chrome: {
        browser: "chrome",
        args: ["-headless"],
        extensions: ["adguardadblocker@adguard.com.xpi"],
      }
  };