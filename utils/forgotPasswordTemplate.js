const forgotPasswordTemplate= ({name,otp})=>{
    return `
    <div style="color:black;">
     <p style="color:black;">Dear, ${name}</p>
      <p style="color:black;"> You're requested a password reset. Please use following OTP to reset your password.</p>

      <div style = "background:#03a5fc; font-size:20px; padding:20px; text-align:center; font-weight:800;">
      ${otp}
      </div>
      </br>
      <p style="color:black;">This otp is valid for 1 hour only. Enter this otp in the Blinkit website to proceed with resetting your password.</p>
      </br>    
      <p>Thanks,</p>
      <p>Blinkit</p>
    </div>
    `
}

export {forgotPasswordTemplate}