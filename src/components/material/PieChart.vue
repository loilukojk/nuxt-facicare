<script>
import { Pie } from "vue-chartjs";
export default {
  extends: Pie,
  props: ["labels", "data"],
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            backgroundColor: [
              "#41B883",
              "#3498db",
              "#9b59b6",
              "#E46651",
              "#00D8FF",
              "#DD1B16",
              "#7f8c8d",
              "#f1c40f",
              "#d35400"
            ],
            data: this.data
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>