<template>
  <v-app>
    <v-content>
      <v-row justify="center">
        <v-col cols="8" md="4">
          <label>Ship Date : </label>
          <v-text-field v-model="value" outlined dense>
             <!-- <template v-slot:append-outer> -->
              <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
         <v-col cols="8" md="4">
        <label>Car ID : </label>
        <v-text-field v-model="value" outlined dense>
             <!-- <template v-slot:append-outer> -->
              <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
         </v-col>
      </v-row>

      <v-row justify="center">
         <v-col cols="8" md="4">
        <label>SO BarCode : </label>
        <v-text-field v-model="value" outlined dense>
             <!-- <template v-slot:append-outer> -->
              <date-picker v-model="value" />
            <!-- </template> -->
          </v-text-field>
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
          "https://erp.bpi-concretepile.co.th/BPI_UAT/api/v2/odata/BPI/Erp.BO.SalesOrderSvc/OrderRels",
           {
            headers: {
            'Authorization': `Basic Y29uNjo5SUpOMG9rbQ==`
            },
            parameter: {
              'API-Key': 's0PAeXYPS9La2YqOxwjF9DdBOyS5JTRqnhASRgPGdZURw'
            }
           }
        );
        
        // JSON responses are automatically parsed.
        this.orderRels = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  created() {
    this.getData();
  },


};
</script>