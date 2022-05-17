interface Vehicle {
  name: string;
  plate: string;
  period: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query)

  function timeCalc(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor((mil % 60000) / 1000);

    return `${min}m e ${sec}s`;
  }

  function garage() {
    function read(): Vehicle[] {
      return localStorage.garage ? JSON.parse(localStorage.garage) : [];
    }

    function toSave(vehicle: Vehicle[]) {
      localStorage.setItem("garage", JSON.stringify(vehicle));
    }

    function toAdd(vehicle: Vehicle, save?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.plate}</td>
        <td data-time="${vehicle.period}">
        ${new Date(vehicle.period)
                .toLocaleString('pt-BR', { 
                    hour: 'numeric', minute: 'numeric' 
        })}
    </td>
        <td>
          <button class="delete" data-plate="${vehicle.plate}">X</button>
        </td>
      `;

      row.querySelector(".delete").addEventListener("click", function () {
        toRemove(this.dataset.plate);
      });

      $("#garage").appendChild(row);

      if (save) toSave([...read(), vehicle]);

      $("#name").value = ""
      $("#plate").value = ""
    }


    function toRemove(plate: string) {
      const { period, name } = read().find((item) => item.plate === plate);

      const time = timeCalc(
        new Date().getTime() - new Date(period).getTime()
      );

      if (!confirm(`O veiculo ${name} ficou estacionado na garagem por ${time}`))
        return;

      toSave(read().filter((vehicle) => vehicle.plate !== plate));
      render();
    }

    function render() {
      $("#garage").innerHTML = "";

      if (read().length) {
        read().forEach((vehicle) => toAdd(vehicle));
      }
    }

    return { read, toAdd, toSave, toRemove, render };
  }

  garage().render();

  $("#register").addEventListener("click", () => {
    const name = $("#name").value;
    const plate = $("#plate").value;

    if (!name.length || !plate.length) {
      alert("Placa e Nome são obrigatórios");
      return;
    }

    const vehicle: Vehicle = { name, plate, period: new Date().toISOString() };

    garage().toAdd(vehicle, true);
  });
})();