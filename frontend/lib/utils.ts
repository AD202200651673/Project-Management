export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    backgroundColor: isDarkMode ? "#1d1f21" : "white",
    color: isDarkMode ? "#e5e7eb" : "inherit",
    borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    "& .MuiDataGrid-main": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      color: isDarkMode ? "#e5e7eb" : "inherit",
    },
    "& .MuiDataGrid-mainContent": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-virtualScrollerContent": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-virtualScrollerRenderZone": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-topContainer": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    },
    "& .MuiDataGrid-bottomContainer": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    },
    "& .MuiDataGrid-scrollArea": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-pinnedColumns": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-pinnedColumnHeaders": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-contentFiller": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      color: isDarkMode ? "#e5e7eb" : "inherit",
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
      '& [role="row"] > *': {
        backgroundColor: isDarkMode ? "#1d1f21" : "white",
        borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
        color: isDarkMode ? "#e5e7eb" : "inherit",
      },
    },
    "& .MuiDataGrid-columnHeadersInner": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      color: isDarkMode ? "#e5e7eb" : "inherit",
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      color: isDarkMode ? "#e5e7eb" : "inherit",
      fontWeight: 600,
    },
    "& .MuiDataGrid-filler": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    },
    "& .MuiDataGrid-scrollbarFiller": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    },
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      padding: "0.5rem",
      "& .MuiButton-root": {
        color: isDarkMode ? "#a3a3a3" : "#374151",
      },
      "& .MuiButton-text": {
        color: isDarkMode ? "#a3a3a3" : "#374151",
      },
      "& .MuiSvgIcon-root": {
        color: isDarkMode ? "#a3a3a3" : "#374151",
      },
    },
    "& .MuiIconButton-root": {
      color: isDarkMode ? "#a3a3a3" : "#6b7280",
    },
    "& .MuiSvgIcon-root": {
      color: isDarkMode ? "#a3a3a3" : "#6b7280",
    },
    "& .MuiDataGrid-sortIcon": {
      color: isDarkMode ? "#a3a3a3" : "#6b7280",
    },
    "& .MuiDataGrid-menuIconButton": {
      color: isDarkMode ? "#a3a3a3" : "#6b7280",
    },
    "& .MuiDataGrid-cell": {
      color: isDarkMode ? "#e5e7eb" : "inherit",
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    },
    "& .MuiDataGrid-row": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
      "&:hover": {
        backgroundColor: isDarkMode ? "#2d3135 !important" : "#f9fafb !important",
      },
      "&.Mui-selected": {
        backgroundColor: isDarkMode ? "#3b3d40 !important" : "#f3f4f6 !important",
        "&:hover": {
          backgroundColor: isDarkMode ? "#4b4d50 !important" : "#e5e7eb !important",
        },
      },
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: isDarkMode ? "#1d1f21 !important" : "white",
      color: isDarkMode ? "#a3a3a3 !important" : "#374151",
      borderColor: isDarkMode ? "#2d3135 !important" : "#e5e7eb",
      borderTop: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
    },
    "& .MuiTablePagination-root": {
      backgroundColor: isDarkMode ? "#1d1f21 !important" : "white",
      color: isDarkMode ? "#a3a3a3 !important" : "#374151",
    },
    "& .MuiTablePagination-toolbar": {
      backgroundColor: isDarkMode ? "#1d1f21 !important" : "white",
    },
    "& .MuiTablePagination-selectLabel": {
      color: isDarkMode ? "#a3a3a3 !important" : "#374151",
    },
    "& .MuiTablePagination-displayedRows": {
      color: isDarkMode ? "#a3a3a3 !important" : "#374151",
    },
    "& .MuiTablePagination-select": {
      color: isDarkMode ? "#a3a3a3 !important" : "#374151",
    },
    "& .MuiTablePagination-selectIcon": {
      color: isDarkMode ? "#a3a3a3 !important" : "#374151",
    },
    "& .MuiTablePagination-actions button": {
      color: isDarkMode ? "#a3a3a3 !important" : "#374151",
    },
    "& .MuiCheckbox-root": {
      color: isDarkMode ? "#a3a3a3" : "#6b7280",
      "&.Mui-checked": {
        color: isDarkMode ? "#3b82f6" : "#2563eb",
      },
    },
    "& .MuiDataGrid-columnSeparator": {
      color: isDarkMode ? "#2d3135" : "#e5e7eb",
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
    },
    "& .MuiDataGrid-overlay": {
      backgroundColor: isDarkMode ? "#1d1f21" : "white",
      color: isDarkMode ? "#e5e7eb" : "inherit",
    },
  };
};