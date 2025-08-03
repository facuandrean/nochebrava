import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { ProductForSelection, PackItemRequest } from "./models";
import type { PackItemResponse } from "./models/packItem.model";
import type { PackRequest } from "./models";
import { useApi } from "../../hooks";
import { Section } from "../section/section";
import { Button } from "../button/button";
import { ModalPost } from "../modal/modalPost";
import { StepPackForm } from "./components/stepPackForm";
import { StepProductSelection } from "./components/stepProductSelection";
import "./pack.css";
import { parsePackData, parsePackDataForBackend, parsePackItemsDataForBackend } from "./utils";
import type { PackResponse, ParsedPack } from "./models/pack.model";
import type Pack from "./models/pack.model";
// import { Filter } from "../filter";
import { Loading } from "../loading/loading";
import { Table, type Column } from "../table/table";

const columns: Column<ParsedPack>[] = [
  { header: "N°", accessor: "pack_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Precio", accessor: "price" },
  { header: "Activo", accessor: "active" },
  { header: "Creado", accessor: "created_at" },
  { header: "Actualizado", accessor: "updated_at" }
];

export const Pack = () => {
  // Estado para manejar el paso actual del wizard.
  const [currentStep, setCurrentStep] = useState(1);
  // Estado para manejar los datos del pack, no los productos seleccionados.
  const [packData, setPackData] = useState<PackRequest | null>(null);
  // Estado para manejar los productos seleccionados que van a conformar el pack.
  const [selectedProducts, setSelectedProducts] = useState<ProductForSelection[]>([]);
  // Estado para manejar los datos de los packs.
  const [filteredData, setFilteredData] = useState<ParsedPack[]>([]);
  const [, setDataEditPack] = useState<ParsedPack | null>(null);
  const [, setDataDeletePack] = useState<ParsedPack | null>(null);

  // Hook para manejar la creación del pack.
  const { trigger: triggerPostPack, loading: apiPostLoading, error: apiPostError } = useApi<PackRequest, PackResponse>({
    url: "http://localhost:3000/api/v1/packs",
    method: "POST"
  });

  const { trigger: triggerPostPackItems, loading: apiPostPackItemsLoading, error: apiPostPackItemsError } = useApi<PackItemRequest[], PackItemResponse>({
    url: "http://localhost:3000/api/v1/pack-items",
    method: "POST"
  });

  const { data, loading, error } = useApi<{ status: string, message: string, data: Pack[] }>({
    url: "http://localhost:3000/api/v1/packs",
    method: "GET",
    autoFetch: true
  });

  useEffect(() => {
    if (data) {
      const packs = data.data;
      const parsedPacks = parsePackData(packs);
      setFilteredData(parsedPacks);
    }
  }, [data]);

  if (error) return <div>{error.message}</div>;
  if (loading) return <Loading className="loading-container" />;

  // Método para pasar al siguiente paso del wizard. Debe validar la data del formulario que hace referencia a los datos del pack. Por eso se usa el SubmitHandler.
  const onNextStep: SubmitHandler<PackRequest> = async (formData: PackRequest) => {
    // Si el formulario es válido, se setean los datos del pack en packData.
    setPackData(formData);
    // Se pasa al siguiente paso del wizard.
    setCurrentStep(2);
  }

  // Método para volver al paso anterior del wizard.
  const onPreviousStep = () => {
    // Se vuelve al paso anterior del wizard.
    setCurrentStep(1);
  }

  const onSubmit = () => {
    console.log('avanzó');
  }

  // Método para finalizar el wizard. Recibe los productos seleccionados que van a conformar el pack.
  const onFinish = async (selectedProducts: ProductForSelection[]) => {

    // Primero creo el pack.
    const packDataForBackend = parsePackDataForBackend(packData as PackRequest);
    const pack = await triggerPostPack(packDataForBackend);

    if (pack) {
      const packItemsForBackend = parsePackItemsDataForBackend(selectedProducts, pack.data.pack_id);

      // Luego creo los pack items.
      await triggerPostPackItems(packItemsForBackend);
    }
  }

  const onEdit = (row: ParsedPack) => {
    setDataEditPack(row);
  }
  const onDelete = (row: ParsedPack) => {
    setDataDeletePack(row);
  }

  // const onFilterChange = (searchText: string) => {
  //   const originalData = parsePackData(packData || []);

  //   if (searchText.trim() === "") {
  //     setFilteredData(originalData);
  //     return;
  //   }

  //   const filtered = originalData.filter(pack =>
  //     pack.name.toLowerCase().includes(searchText.toLowerCase())
  //   );

  //   setFilteredData(filtered);
  // }

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

        {/* <Filter onFilterChange={onFilterChange} /> */}

        <div className="table-container">
          {(() => {
            if (loading) return <Loading className="table-container-loading" />;
            if (!data?.data || data.data.length === 0) return <div className="no-results-message"><span>No hay packs.</span></div>;
            if (filteredData.length === 0) return <div className="no-results-message"><span>No se encontraron resultados.</span></div>;

            return (
              <Table
                columns={columns}
                data={filteredData}
                classNameEspecificTable="table-products"
                dataBsToggle="modal"
                dataBsTargetEdit="#editProductModal"
                dataBsTargetDelete="#deleteProductModal"
                onEdit={onEdit}
                onDelete={onDelete} />
            )
          })()}
        </div>
      </Section>

      <ModalPost
        id="createPackModal"
        title="Crear pack"
        formId="createPackForm"
        loading={apiPostLoading}
        step={currentStep}
        onSubmit={onSubmit}
        onFinish={() => onFinish(selectedProducts)}
        onCancel={() => {
          setPackData({
            name: "",
            description: "",
            price: 0,
            active: true
          });
          setSelectedProducts([]);
          setCurrentStep(1);
        }}
      >

        {currentStep === 1 && (
          <StepPackForm
            idModal="createPackModal"
            formId="createPackForm"
            onNextStep={onNextStep}
            apiLoading={apiPostLoading}
            apiError={apiPostError}
            mode="create"
            initialValues={packData as PackRequest}
          />
        )}

        {currentStep === 2 && (
          <StepProductSelection
            onPreviousStep={onPreviousStep}
            apiPostLoading={apiPostLoading}
            selectedProducts={selectedProducts} // Lo envío porque necesito ver la información de los productos seleccionados hasta el momento.
            setSelectedProducts={setSelectedProducts}
            setStep={setCurrentStep}
            setPackData={setPackData}
            idModal="createPackModal"
            apiPostPackItemsLoading={apiPostPackItemsLoading}
            apiError={apiPostPackItemsError?.message}
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