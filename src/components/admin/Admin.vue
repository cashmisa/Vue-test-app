<template>
  <div class="container">
    <h1>This is admin page</h1>
    <div class="input">
      <label for="sgZip">Singapore Zip</label>
      <TheMask
        id="sgZip"
        mask="######"
        placeholder="123456"
        v-model="sgZip"
        class="input"></TheMask>
      <p>{{sgZip}}</p>

      <label for="sgPhone">Singapore Phone</label>
      <TheMask
        id="sgPhone"
        placeholder="+65"
        mask="+65 ####-####"
        v-model="sgPhone"
        class="input"></TheMask>
      <p>{{sgPhone}}</p>

      <label for="cnPhone">Singapore Phone</label>
      <TheMask
        id="cnPhone"
        placeholder="+86(012)3456-7890"
        :mask="['+86 (###) ####-####', '+86 ####-###-####']"
        v-model="cnPhone"
        class="input"></TheMask>
      <p>{{cnPhone}}</p>
      <hr>
      <div class="inline">
        <label for="sgInvoice">Singapore Invoice</label>
        <input type="radio" id="sgInvoice"
               @change="updateLocale"
               v-model="invoiceLocale" value="sgInvoice">
        <label for="cnInvoice">China Invoice</label>
        <input type="radio" id="cnInvoice"
               @change="updateLocale"
               v-model="invoiceLocale" value="cnInvoice">
      </div>
      <p>{{invoiceLocale}}</p>
      <br>
      <label for="invoiceNo">Invoice No starts with SG or CN depends on selection</label>
      <TheMask
        id="invoiceNo"
        :mask="invoiceMask"
        :placeholder="invoiceMask"
        class="input"></TheMask>

      <label for="supplierCode">Supplier Code AB123-456/78 or AB12345/6</label>
      <TheMask
        id="supplierCode"
        :mask="['AA###-###/##', 'AA#####/#']"
        placeholder="SG123-456/##"
        class="input"></TheMask>
      <hr>
      <label for="timeSubmitted">Time submitted</label>
      <TheMask
        id="timeSubmitted"
        mask=""
        class="input"></TheMask>

      <label for="fromDate">From</label>
      <TheMask
        id="fromDate"
        mask=""
        class="input"></TheMask>

      <label for="toDate">To</label>
      <TheMask
        id="toDate"
        mask=""
        class="input"></TheMask>

      <label for="creditCard">Credit Card</label>
      <TheMask
        id="creditCard"
        mask=""
        class="input"></TheMask>
    </div>

  </div>
</template>
<script>
  import { TheMask } from 'vue-the-mask'

  export default {
    components: {TheMask},
    data () {
      return {
        sgZip: null,
        sgPhone: null,
        cnPhone: null,
        invoiceLocale: null,
        invoiceNo: null,
        supplierCode: null,
        timeSubmitted: null,
        fromDate: null,
        toDate: null,
        sgPlate: null,
        creditCard: null,
        invoiceMask:'SG####-####',
      }
    },
    methods: {
      updateLocale(){
        if (this.invoiceLocale == 'cnInvoice'){
          this.invoiceMask = "CN####-####"
        }
        else{
          this.invoiceMask = "SG####-####"
        }
      }
    }
  }
</script>
<style scoped>
  .text-danger {
    color: red;
  }
  .text-warning {
    color: orange;
  }
  .inline{
    display: inline-block;
  }
  hr {
    color: lightcyan;
    border: 0.5px solid lightgray;
    margin: 20px;
  }

  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input.invalid label {
    color: red;
  }

  .input.invalid input {
    border: 1px solid red;
    background-color: #ffc9aa;
  }

  .input.warning input {
    border: 1px solid orange;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>
