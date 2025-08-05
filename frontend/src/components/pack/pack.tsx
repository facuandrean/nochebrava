import { useApi } from "../../hooks";
import { Section } from "../section/section";
import { Button } from "../button/button";
import "./pack.css";
import type { PackRequest, PackResponse, PackListResponse, ParsedPack } from "./models/pack.model";
import type Pack from "./models/pack.model";
import { Loading } from "../loading/loading";
import { Table, type Column } from "../table/table";
import { useEffect, useState } from "react";
import { parsePackData, parsePackDataForBackend, parsePackItemsDataForBackend } from "./utils";
import { Filter } from "../filter";
import type { PackItemRequest, ProductForSelection } from "./models";
import { ModalPost } from "../modal/modalPost";
import { StepPackForm } from "./components/stepPackForm";
import type { SubmitHandler } from "react-hook-form";
import type { PackItemListResponse } from "./models/packItem.model";
import { StepProductSelection } from "./components/stepProductSelection";

const columns: Column<ParsedPack>[] = [
  { header: "N°", accessor: "pack_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Productos y Cantidades", accessor: "pack_items" },
  { header: "Precio", accessor: "price" },
  { header: "Activo", accessor: "active" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
];

export const Pack = () => {

  // Estado para manejar los datos de los packs.
  const [parsedData, setParsedData] = useState<ParsedPack[]>([]);
  const [filteredData, setFilteredData] = useState<ParsedPack[]>([]);
  // // Estado para manejar los datos del pack a editar.
  const [dataEditPack, setDataEditPack] = useState<ParsedPack | null>(null);
  // // Estado para manejar los datos del pack a eliminar.
  const [dataDeletePack, setDataDeletePack] = useState<ParsedPack | null>(null);

  // Estado para manejar el paso actual del wizard.
  const [currentStep, setCurrentStep] = useState(1);
  // Estado para manejar los datos del pack, no los productos seleccionados.
  const [packData, setPackData] = useState<PackRequest | null>(null); // packData es lo que se envía al backend.
  // Estado para manejar los productos seleccionados que van a conformar el pack.
  const [selectedProducts, setSelectedProducts] = useState<ProductForSelection[]>([]);
  // Estado para manejar errores de validación
  const [validationError, setValidationError] = useState<string | null>(null);

  // Hook para manejar la obtención de los packs.
  const { data, loading, error } = useApi<unknown, PackListResponse>({
    url: "http://localhost:3000/api/v1/packs",
    method: "GET",
    autoFetch: true
  });

  // Hook para manejar la creación del pack.
  const { trigger: triggerPostPack, loading: apiPostPackLoading, error: apiPostPackError } = useApi<PackRequest, PackResponse>({
    url: "http://localhost:3000/api/v1/packs",
    method: "POST"
  });

  // Hook para manejar la creación de los pack items.
  const { trigger: triggerPostPackItems, loading: apiPostPackItemsLoading, error: apiPostPackItemsError } = useApi<PackItemRequest[], PackItemListResponse>({
    url: "http://localhost:3000/api/v1/pack-items",
    method: "POST"
  });

  // Procesa los datos de los packs y los parsea para mostrarlos en la tabla.
  useEffect(() => {
    if (data) {
      const packs = data.data;
      const parsedPacks = parsePackData(packs);
      setParsedData(parsedPacks);
      setFilteredData(parsedPacks);
    }
  }, [data]);

  if (loading) return <Loading className="loading-container" />; // Revisar porque loading nunca es true.
  if (error) return <div>{error.message}</div>;

  // Método para pasar al siguiente paso del wizard. Debe validar la data del formulario que hace referencia a los datos del pack. Por eso se usa el SubmitHandler.
  const onNextStep: SubmitHandler<PackRequest> = async (formData: PackRequest) => {
    // Si el formulario es válido, se setean los datos del pack en packData.
    setPackData(formData);
    // Se pasa al siguiente paso del wizard.
    setCurrentStep(2);
  }

  // Método para volver al paso anterior del wizard.
  const onPreviousStep = () => {
    // Limpiar errores de validación al cambiar de paso
    setValidationError(null);
    // Se vuelve al paso anterior del wizard.
    setCurrentStep(1);
  }

  // Método para finalizar el wizard. Recibe los productos seleccionados que van a conformar el pack.
  const onFinish = async (selectedProducts: ProductForSelection[]) => {
    // Limpiar errores previos
    setValidationError(null);

    // Validar que se hayan seleccionado productos
    if (selectedProducts.length === 0) {
      setValidationError("Debes seleccionar al menos un producto para crear el pack.");

      setTimeout(() => {
        setValidationError(null);
      }, 2000);
      return;
    }

    // Validar que todos los productos seleccionados tengan cantidad mayor a 0
    const invalidProducts = selectedProducts.filter(product => !product.quantity || product.quantity <= 0);
    if (invalidProducts.length > 0) {
      setValidationError("Todos los productos seleccionados deben tener una cantidad mayor a 0.");

      setTimeout(() => {
        setValidationError(null);
      }, 2000);
      return;
    }

    // Primero creo el pack.
    const packDataForBackend: PackRequest = parsePackDataForBackend(packData as PackRequest);
    const pack = await triggerPostPack(packDataForBackend);

    if (pack) {
      const packItemsForBackend: PackItemRequest[] = parsePackItemsDataForBackend(selectedProducts, pack.data.pack_id);

      // Luego creo los pack items.
      await triggerPostPackItems(packItemsForBackend);
    }

  }

  /**
   * Método para cancelar el wizard.
   * @returns setea los estados a sus valores iniciales.
   */
  const onCancel = () => {
    setPackData({
      name: "",
      description: "",
      price: 0,
      active: true
    });
    setSelectedProducts([]);
    setCurrentStep(1);
    setValidationError(null);
  }

  const onEdit = (row: ParsedPack) => {
    setDataEditPack(row);
  }

  const onDelete = (row: ParsedPack) => {
    setDataDeletePack(row);
  }

  /**
   * Filtra los packs por nombre.
   * @param searchText - El texto a buscar.
   * @returns setea en filteredData los packs filtrados.
   */
  const onFilterChange = (searchText: string) => {
    if (searchText.trim() === "") {
      setFilteredData(parsedData);
      return;
    }

    const filtered = parsedData.filter(pack => {
      return pack.name.toLowerCase().includes(searchText.toLowerCase())
    });

    setFilteredData(filtered);
  }

  console.log('dataEditPack', dataEditPack);
  console.log('dataDeletePack', dataDeletePack);

  return (
    <>
      <Section
        title="Administrar packs"
        description="Gestiona los packs de productos que vendes."
      >
        <Button
          label="Crear pack"
          parentMethod={() => { }}
          dataBsToggle="modal"
          dataBsTarget="#createPackModal"
        />

        <Filter onFilterChange={onFilterChange} />

        <div className="table-container">
          {(() => {
            if (loading) return <Loading className="table-container-loading" />;
            if (data === null && !loading) return <div className="no-results-message"><span>No hay packs.</span></div>;
            if (filteredData.length === 0 && !loading) return <div className="no-results-message"><span>No se encontraron resultados.</span></div>;

            return (
              <Table
                columns={columns}
                data={filteredData}
                classNameEspecificTable="table-packs"
                dataBsToggle="modal"
                dataBsTargetEdit="#editPackModal"
                dataBsTargetDelete="#deletePackModal"
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          })()}
        </div>
      </Section>

      <ModalPost
        id="createPackModal"
        title="Crear pack"
        formId="createPackForm"
        loading={apiPostPackLoading}
        step={currentStep}
        onFinish={() => onFinish(selectedProducts)}
        onCancel={onCancel}
      >

        {currentStep === 1 && (
          <StepPackForm
            idModal="createPackModal"
            formId="createPackForm"
            onNextStep={onNextStep}
            apiLoading={apiPostPackLoading}
            apiError={apiPostPackError ? apiPostPackError : null}
            mode="create"
            initialValues={packData as PackRequest}
          />
        )}

        {currentStep === 2 && (
          <StepProductSelection
            onPreviousStep={onPreviousStep}
            selectedProducts={selectedProducts} // Lo envío porque necesito ver la información de los productos seleccionados hasta el momento.
            setSelectedProducts={setSelectedProducts}
            setStep={setCurrentStep}
            setPackData={setPackData}
            idModal="createPackModal"
            apiPostPackItemsLoading={apiPostPackItemsLoading}
            apiError={apiPostPackItemsError?.message}
            validationError={validationError}
          />
        )}
      </ModalPost>

      {/* <ModalEdit
        id="editPackModal"
        title="Editar pack"
        formId="editPackForm"
        loading={apiEditLoading}
      >
        <span>Acá iria el contenedor de pasos</span>
      </ModalEdit> */}
    </>
  );
}