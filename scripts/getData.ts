import DrugService from "../shared/services/drugs.service";

const main = async () => {
    const results = await DrugService.GetAllDrugs();
    console.log(results);
}