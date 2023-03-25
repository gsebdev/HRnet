import './app.scss';
import { states } from './config/states'
import { departments } from './config/departements'

function App() {

  return (
    <div className="App">
      <h1>HRnet</h1>
      <a href='/'>View Current Employees</a>
      <h2>Create Employee</h2>
      <form>
        <label htmlFor="">First Name</label>
        <input type='text' />
        <label htmlFor="">Last Name</label>
        <input type='text' />
        <fieldset class="address">
          <legend>Address</legend>

          <label for="street">Street</label>
          <input id="street" type="text" />

          <label for="city">City</label>
          <input id="city" type="text" />

          <label for="state-button">State</label>
          <select name="state" id="state">
            {states.map((state, index) => {
              return <option key={state.name + index} value={state.abbreviation}>{state.name}</option>
            })}
          </select>
          <label for="zip-code">Zip Code</label>
          <input id="zip-code" type="number" />
        </fieldset>
        <select name='department' id='department'>
          {departments.map((department, index) => {
            return <option key={department + index}>{department}</option>
          })}
        </select>
        <button type='submit'>Save</button>
      </form>

    </div>
  );
}

export default App;
