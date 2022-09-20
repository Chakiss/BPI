<template>
  <v-app>
    <v-content>
      <v-row justify="center">
        <v-col cols="8" md="4">
          <image src="./assets/logo.png" alt="Scripts"></image>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8" md="4">
          <label>Ship Date : </label>
          <v-text-field v-model="value" outlined dense hide-details>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8" md="4">
          <label>Car ID : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8" md="4">
          <label>SO BarCode : </label>
          <v-text-field v-model="value" outlined dense hide-detai @click="scanQR">
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="2" md="1">
          <label>Oder : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
        <v-col cols="2" md="1">
          <label>Line : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
        <v-col cols="4" md="2">
          <label>Rel : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="4" md="2">
          <label>Part : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
        <v-col cols="4" md="2">
          <label>Order Qty : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="4" md="2">
          <label>Wherehouse : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
        <v-col cols="4" md="2">
          <label>Bin : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8" md="4">
          <label>Partner Barcode : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8" md="4">
          <label>Code : </label>
          <v-text-field v-model="value" outlined dense hide-detai>
            <!-- <template v-slot:append-outer> -->
            <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8" md="4">
          <!-- <v-data-table dense :headers="headers" :items="desserts" item-key="name" class="elevation-1"></v-data-table> -->
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="4" md="2">
          <v-btn elevation="2"> Delete all</v-btn>
        </v-col>

        <v-col cols="4" md="2">
          <v-btn elevation="2"> Clear Data</v-btn>
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import DatePicker from "./components/DatePicker";

export default {
  name: "App",
  components: {
    DatePicker,
  },
  data() {
    return {
      value: null,
      orderRels: [],
    };
  },
  methods: {
    async getData() {
      try {
        const response = await this.$http.get(
          "https://erp.bpi-concretepile.co.th/BPI_UAT/api/v2/odata/BPI/Erp.BO.WhseBinSvc/WhseBins('BPI','BRC01','A01')?API-Key=s0PAeXYPS9La2YqOxwjF9DdBOyS5JTRqnhASRgPGdZURw",
          {
            headers: {
              Authorization: `Basic Y29uNjo5SUpOMG9rbQ==`,
            },
            parameter: {
              "API-Key": "s0PAeXYPS9La2YqOxwjF9DdBOyS5JTRqnhASRgPGdZURw",
            },
          }
        );

        // JSON responses are automatically parsed.
        this.orderRels = response.data;
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    },

    async scanQR() {
      console.log("xxxx");
    },
  },

  created() {
    this.getData();
  },
};
</script>