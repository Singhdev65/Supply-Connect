import { Grid, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";

import { ProductCard } from "../../products/components";
import {
  AddProductWizardModal,
  VendorAnalyticsPanel,
  VendorBoardHeader,
  VendorFinancePanel,
  VendorOrdersStats,
  VendorOrdersPanel,
  VendorPromotionsPanel,
} from "../components";
import { useVendorBoard } from "../hooks";

const ITEM_HEIGHT = 420;

const VendorDashboard = () => {
  const {
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    showWizard,
    editingProduct,
    sortedProducts,
    productsLoading,
    deleteProduct,
    orders,
    ordersLoading,
    orderStats,
    report,
    reportLoading,
    reportDays,
    setReportDays,
    updateOrderStatus,
    openCreateWizard,
    openEditWizard,
    openProductDetails,
    closeWizard,
    commitWizardSuccess,
    promotions,
    promotionsLoading,
    promotionsSaving,
    promotionForm,
    setPromotionForm,
    editingPromotionId,
    startPromotionCreate,
    startPromotionEdit,
    savePromotion,
    togglePromotion,
    archivePromotion,
    financeDays,
    setFinanceDays,
    financeSummary,
    financeTransactions,
    financePayouts,
    financeTaxReport,
    financeLoading,
    payoutRequesting,
    payoutAmount,
    setPayoutAmount,
    requestPayout,
  } = useVendorBoard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 space-y-4">
        <VendorBoardHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onCreateProduct={openCreateWizard}
        />

        {activeTab === "orders" && (
          <VendorOrdersStats orderStats={orderStats} />
        )}

        {activeTab === "analytics" && (
          <VendorAnalyticsPanel
            report={report}
            loading={reportLoading}
            reportDays={reportDays}
            setReportDays={setReportDays}
          />
        )}
      </div>

      {activeTab === "products" && !productsLoading && (
        <div className="h-[700px] px-4">
          <AutoSizer>
            {({ width, height }) => {
              const columns =
                width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4;
              const columnWidth = Math.floor(width / columns);
              const rows = Math.ceil(sortedProducts.length / columns);

              return (
                <Grid
                  width={width}
                  height={height}
                  columnCount={columns}
                  columnWidth={columnWidth}
                  rowCount={rows}
                  rowHeight={ITEM_HEIGHT}
                  cellRenderer={({ columnIndex, rowIndex, key, style }) => {
                    const index = rowIndex * columns + columnIndex;
                    if (!sortedProducts[index]) return null;

                    return (
                      <div key={key} style={{ ...style, padding: 8 }}>
                        <ProductCard
                          product={sortedProducts[index]}
                          deleteProduct={deleteProduct}
                          onEdit={openEditWizard}
                          onOpenProduct={() => openProductDetails(sortedProducts[index])}
                          isVendor
                        />
                      </div>
                    );
                  }}
                />
              );
            }}
          </AutoSizer>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="px-4 pb-8">
          <VendorOrdersPanel
            orders={orders}
            loading={ordersLoading}
            onStatusUpdate={updateOrderStatus}
          />
        </div>
      )}
      {activeTab === "products" && productsLoading && (
        <div className="px-4 pb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            Loading products...
          </div>
        </div>
      )}

      {activeTab === "promotions" && (
        <div className="px-4 pb-8">
          <VendorPromotionsPanel
            promotions={promotions}
            loading={promotionsLoading}
            form={promotionForm}
            setForm={setPromotionForm}
            saving={promotionsSaving}
            editingId={editingPromotionId}
            onSave={savePromotion}
            onEdit={startPromotionEdit}
            onToggle={togglePromotion}
            onArchive={archivePromotion}
            onResetForm={startPromotionCreate}
          />
        </div>
      )}

      {activeTab === "finance" && (
        <div className="px-4 pb-8">
          <VendorFinancePanel
            days={financeDays}
            setDays={setFinanceDays}
            summary={financeSummary}
            transactions={financeTransactions}
            payouts={financePayouts}
            taxReport={financeTaxReport}
            loading={financeLoading}
            requestAmount={payoutAmount}
            setRequestAmount={setPayoutAmount}
            requestPayout={requestPayout}
            requesting={payoutRequesting}
          />
        </div>
      )}

      {showWizard && (
        <AddProductWizardModal
          product={editingProduct}
          onClose={closeWizard}
          onSuccess={commitWizardSuccess}
        />
      )}
    </div>
  );
};

export default VendorDashboard;
