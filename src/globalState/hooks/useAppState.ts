// // useAppState.ts
// import { useEffect } from 'react'
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
// import type { RootState, AppDispatch } from '../store' // adjust path if needed

// // UI imports
// import {
//   setSidebarOpen,
//   setExpandedItems,
//   setActiveItem,
//   setActiveComponent,
//   setSidebarWidth,
//   toggleCollapse,
//   setHeaderComponentRender,
//   setIsFullscreen,
//   selectSidebarOpen,
//   selectExpandedItems,
//   selectActiveItem,
//   selectActiveComponent,
//   selectSidebarWidth,
//   selectIsCollapsed,
//   selectHeaderComponentRender,
//   selectIsFullscreen
// } from '../features/uiSlice'

// // Hierarchy imports
// import {
//   fetchHierarchyData,
//   setCompanyDetails,
//   setBranchDetails,
//   setDivDetails,
//   setDeptDetails,
//   clearErrors,
//   setError,
//   selectCompanyDetails,
//   selectBranchDetails,
//   selectDivDetails,
//   selectDeptDetails,
//   selectHierarchyLoading,
//   selectHierarchyErrors
// } from '../features/hierarchySlice'

// // Form imports
// import {
//   setFormData,
//   clearFormErrors,
//   setFormError,
//   resetForm,
//   selectFormData,
//   selectFormErrors
// } from '../features/formSlice'

// // Config imports
// import { selectConfig } from '../features/configSlice'

// // Master imports
// import {
//   setSearchTerm,
//   setSelectedCategory,
//   setViewMode,
//   setCurrentScreen,
//   setSelectedMaster,
//   selectMasterData,
//   selectSearchTerm,
//   selectCurrentScreen,
//   selectSelectedCategory,
//   selectViewMode,
//   selectSelectedMaster
// } from '../features/masterSlice'

// // Decode imports
// import {
//   decryptData,
//   clearDecryptedData,
//   clearError as clearDecodeErrorAction,
//   selectDecryptedData,
//   selectIsLoading,
//   selectError,
//   selectUserData,
//   setUserData
// } from '../features/decodeSlice'

// import {clearHierarchy,selectCompanyHierarchy, selectCompanyHierarchyLoading,selectCompanyHierarchyError } from '../features/hierarchyCompanyDetailsSlice'
// /**
//  * Typed hooks for dispatch & selector
//  * Requires your store to export RootState and AppDispatch.
//  */
// export const useAppDispatch = () => useDispatch<AppDispatch>()
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// /**
//  * The main hook
//  */
// export const useAppState = () => {
//   const dispatch = useAppDispatch()

//   // UI
//   const ui = {
//     sidebarOpen: useAppSelector(selectSidebarOpen),
//     expandedItems: useAppSelector(selectExpandedItems),
//     activeItem: useAppSelector(selectActiveItem),
//     activeComponent: useAppSelector(selectActiveComponent),
//     sidebarWidth: useAppSelector(selectSidebarWidth),
//     isCollapsed: useAppSelector(selectIsCollapsed),
//     headerComponentRender: useAppSelector(selectHeaderComponentRender),
//     isFullscreen: useAppSelector(selectIsFullscreen)
//   }

//   // Hierarchy
//   const hierarchy = {
//     companyDetails: useAppSelector(selectCompanyDetails),
//     branchDetails: useAppSelector(selectBranchDetails),
//     divDetails: useAppSelector(selectDivDetails),
//     deptDetails: useAppSelector(selectDeptDetails),
//     loading: useAppSelector(selectHierarchyLoading),
//     errors: useAppSelector(selectHierarchyErrors)
//   }

//   // Form
//   const form = {
//     formData: useAppSelector(selectFormData),
//     errors: useAppSelector(selectFormErrors)
//   }

//   // Master
//   const master = {
//     searchTerm: useAppSelector(selectSearchTerm),
//     selectedCategory: useAppSelector(selectSelectedCategory),
//     viewMode: useAppSelector(selectViewMode),
//     currentScreen: useAppSelector(selectCurrentScreen),
//     selectedMaster: useAppSelector(selectSelectedMaster)
//   }

//   // Config
//   const config = useAppSelector(selectConfig)

//   // Decode
//   const decode = {
//     decryptedData: useAppSelector(selectDecryptedData),
//     isLoading: useAppSelector(selectIsLoading),
//     error: useAppSelector(selectError),
//     userData: useAppSelector(selectUserData)
//   }

//   useEffect(() => {
//     if (form.formData !== null) {
//       dispatch(fetchHierarchyData(form.formData))
//     }
//   }, [dispatch, form.formData])

//   return {
//     // state
//     ...ui,
//     ...hierarchy,
//     ...form,
//     ...master,
//     ...decode,
//     config,

//     // UI Actions
//     setSidebarOpen: (value: boolean) => dispatch(setSidebarOpen(value)),
//     setExpandedItems: (items: Record<string, boolean>) =>
//       dispatch(setExpandedItems(items)),
//     setActiveItem: (item: string) => dispatch(setActiveItem(item)),
//     setActiveComponent: (component: string) =>
//       dispatch(setActiveComponent(component)),
//     setSidebarWidth: (width: number) => dispatch(setSidebarWidth(width)),
//     toggleCollapse: () => dispatch(toggleCollapse()),
//     setHeaderComponentRender: (component: string) =>
//       dispatch(setHeaderComponentRender(component)),
//     setIsFullscreen: (fullscreen: boolean) => dispatch(setIsFullscreen(fullscreen)),

//     // Hierarchy Actions
//     setCompanyDetails: (details: any[]) => dispatch(setCompanyDetails(details)),
//     setBranchDetails: (details: any[]) => dispatch(setBranchDetails(details)),
//     setDivDetails: (details: any[]) => dispatch(setDivDetails(details)),
//     setDeptDetails: (details: any[]) => dispatch(setDeptDetails(details)),
//     clearErrors: () => dispatch(clearErrors()),
//     setError: (error: Record<string, any>) => dispatch(setError(error)),

//     // Form Actions
//     setFormData: (data: any) => dispatch(setFormData(data)),
//     clearFormErrors: () => dispatch(clearFormErrors()),
//     setFormError: (error: Record<string, string>) => dispatch(setFormError(error)),
//     resetForm: () => dispatch(resetForm()),

//     // Master data Actions
//     setSearchTerm: (term: string) => dispatch(setSearchTerm(term)),
//     setSelectedCategory: (category: string) => dispatch(setSelectedCategory(category)),
//     setViewMode: (mode: 'grid' | 'list') => dispatch(setViewMode(mode)),
//     setCurrentScreen: (screen: string) => dispatch(setCurrentScreen(screen)),
//     setSelectedMaster: (master: any) => dispatch(setSelectedMaster(master)),

//     // Async Actions
//     fetchHierarchyData: (data: any) => dispatch(fetchHierarchyData(data)),

//     // Decode Actions
//     decryptData: (payload: any) => dispatch(decryptData(payload)),
//     clearDecryptedData: () => dispatch(clearDecryptedData()),
//     clearDecodeError: () => dispatch(clearDecodeErrorAction()),
//     setUserData: (data: any) => dispatch(setUserData(data)),
//     // Hierarchy Company Details Actions
//     clearHierarchy: () => dispatch(clearHierarchy()),

//   }
// }
    // useAppState.ts
import { useEffect } from "react"
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux"
import type { RootState, AppDispatch } from "../store"

// ================= UI =================
import {
  setSidebarOpen,
  setExpandedItems,
  setActiveItem,
  setActiveComponent,
  setSidebarWidth,
  toggleCollapse,
  setHeaderComponentRender,
  setIsFullscreen,
  selectSidebarOpen,
  selectExpandedItems,
  selectActiveItem,
  selectActiveComponent,
  selectSidebarWidth,
  selectIsCollapsed,
  selectHeaderComponentRender,
  selectIsFullscreen
} from "../features/uiSlice"

// ================= FORM =================
import {
  setFormData,
  clearFormErrors,
  setFormError,
  resetForm,
  selectFormData,
  selectFormErrors
} from "../features/formSlice"

// ================= MASTER =================
import {
  setSearchTerm,
  setSelectedCategory,
  setViewMode,
  setCurrentScreen,
  setSelectedMaster,
  selectSearchTerm,
  selectCurrentScreen,
  selectSelectedCategory,
  selectViewMode,
  selectSelectedMaster
} from "../features/masterSlice"

// ================= CONFIG =================
import { selectConfig } from "../features/configSlice"

// ================= DECODE =================
import {
  decryptData,
  clearDecryptedData,
  clearError as clearDecodeErrorAction,
  selectDecryptedData,
  selectIsLoading,
  selectError,
  selectUserData,
  setUserData
} from "../features/decodeSlice"

// ================= HIERARCHY COMPANY DETAILS =================
import {
  fetchHierarchy,
  clearHierarchy,
  selectCompanyHierarchy,
  selectCompanyHierarchyLoading,
  selectCompanyHierarchyError
} from "../features/hierarchyCompanyDetailsSlice"

// ================= TYPED HOOKS =================
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// ================= MAIN HOOK =================
export const useAppState = () => {
  const dispatch = useAppDispatch()

  // ---------- UI ----------
  const ui = {
    sidebarOpen: useAppSelector(selectSidebarOpen),
    expandedItems: useAppSelector(selectExpandedItems),
    activeItem: useAppSelector(selectActiveItem),
    activeComponent: useAppSelector(selectActiveComponent),
    sidebarWidth: useAppSelector(selectSidebarWidth),
    isCollapsed: useAppSelector(selectIsCollapsed),
    headerComponentRender: useAppSelector(selectHeaderComponentRender),
    isFullscreen: useAppSelector(selectIsFullscreen)
  }

  // ---------- FORM ----------
  const form = {
    formData: useAppSelector(selectFormData),
    errors: useAppSelector(selectFormErrors)
  }

  // ---------- MASTER ----------
  const master = {
    searchTerm: useAppSelector(selectSearchTerm),
    selectedCategory: useAppSelector(selectSelectedCategory),
    viewMode: useAppSelector(selectViewMode),
    currentScreen: useAppSelector(selectCurrentScreen),
    selectedMaster: useAppSelector(selectSelectedMaster)
  }

  // ---------- CONFIG ----------
  const config = useAppSelector(selectConfig)

  // ---------- DECODE ----------
  const decode = {
    decryptedData: useAppSelector(selectDecryptedData),
    isLoading: useAppSelector(selectIsLoading),
    error: useAppSelector(selectError),
    userData: useAppSelector(selectUserData)
  }

  // ---------- HIERARCHY COMPANY DETAILS ----------
  const hierarchyCompany = {
    data: useAppSelector(selectCompanyHierarchy),
    loading: useAppSelector(selectCompanyHierarchyLoading),
    error: useAppSelector(selectCompanyHierarchyError)
  }

  // ---------- AUTO FETCH (ONCE / CACHE AWARE) ----------
  useEffect(() => {
    if (!hierarchyCompany.data && !hierarchyCompany.loading) {
      dispatch(fetchHierarchy())
    }
  }, [dispatch])

  return {
    // ===== STATE =====
    ...ui,
    ...form,
    ...master,
    ...decode,
    ...hierarchyCompany,
    config,

    // ===== UI ACTIONS =====
    setSidebarOpen: (value: boolean) => dispatch(setSidebarOpen(value)),
    setExpandedItems: (items: Record<string, boolean>) =>
      dispatch(setExpandedItems(items)),
    setActiveItem: (item: string) => dispatch(setActiveItem(item)),
    setActiveComponent: (component: string) =>
      dispatch(setActiveComponent(component)),
    setSidebarWidth: (width: number) => dispatch(setSidebarWidth(width)),
    toggleCollapse: () => dispatch(toggleCollapse()),
    setHeaderComponentRender: (component: string) =>
      dispatch(setHeaderComponentRender(component)),
    setIsFullscreen: (fullscreen: boolean) =>
      dispatch(setIsFullscreen(fullscreen)),

    // ===== FORM ACTIONS =====
    setFormData: (data: any) => dispatch(setFormData(data)),
    clearFormErrors: () => dispatch(clearFormErrors()),
    setFormError: (error: Record<string, string>) =>
      dispatch(setFormError(error)),
    resetForm: () => dispatch(resetForm()),

    // ===== MASTER ACTIONS =====
    setSearchTerm: (term: string) => dispatch(setSearchTerm(term)),
    setSelectedCategory: (category: string) =>
      dispatch(setSelectedCategory(category)),
    setViewMode: (mode: "grid" | "list") =>
      dispatch(setViewMode(mode)),
    setCurrentScreen: (screen: string) =>
      dispatch(setCurrentScreen(screen)),
    setSelectedMaster: (master: any) =>
      dispatch(setSelectedMaster(master)),

    // ===== DECODE ACTIONS =====
    decryptData: (payload: any) => dispatch(decryptData(payload)),
    clearDecryptedData: () => dispatch(clearDecryptedData()),
    clearDecodeError: () => dispatch(clearDecodeErrorAction()),
    setUserData: (data: any) => dispatch(setUserData(data)),

    // ===== HIERARCHY ACTIONS =====
    fetchCompanyHierarchy: () => dispatch(fetchHierarchy()),
    clearCompanyHierarchy: () => dispatch(clearHierarchy())
  }
}
