## Utility README

### This project contains a list of utility classes

#### Multi-step web form class
#### List of classes to interact with HTML5 canvas
#### Loader class
#### Limiter class (disables certain element after event hits a limit)

### Multi-step form
``` html
<form action="sales-entry" class="step-form" id="contact-info">
  <div class="steps"></div>
  <div class="tab" data-name="Contact">
    <input type="hidden" class="form-input" name="lat">
    <input required type="text" class="form-input" name="first_name" placeholder="First Name">
    <input type="text" class="form-input" name="last_name" placeholder="Last Name">
    <input required type="email" class="form-input" name="email" placeholder="Email">
    <input required type="tel" class="form-input" name="phone" placeholder="Phone Number">
  </div>
  <div class="tab" data-name="Address">
    <input type="hidden" class="form-input" name="lat">
    <input required type="text" class="form-input" name="line1" placeholder="Address">
    <input type="text" class="form-input" name="line2" placeholder="Address Line 2">
    <input required type="text" class="form-input" name="city" placeholder="City">
    <input required type="text" class="form-input" name="state" placeholder="State">
    <input required type="text" class="form-input" name="postal_code" placeholder="Zip Code">
  </div>
  <div class="tab" data-name="Message">
    <select required class="form-input" name="languages">
      <option value="en" selected>English</option>
      <option value="fr">French</option>
      <option value="es">Spanish</option>
      <option value="de">German</option>
    </select>
    <textarea 
      class="form-input"
      required 
      name="message" 
      placeholder="Enter your comments here..." 
      rows="5" 
      cols="50">
    </textarea>
  </div>
  <div class="controller">
    <div class="status"></div>
    <div class="group">
      <button name="prev" type="button" class="btn">Go Back</button>
      <a href="https://google.com" class="btn">Custom button</a>
      <button name="next" type="button" class="btn">Check Now</button>
    </div>
  </div>
</form>
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

