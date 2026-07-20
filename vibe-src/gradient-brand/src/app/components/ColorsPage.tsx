import { useState, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  ChevronsUpDown,
  List as ListIcon,
  LayoutGrid,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast, Toaster } from "sonner";
import { typographyStyles } from "./TypographyHelpers";
import { allColorTokens, type ColorToken } from "./ColorTokensData";

interface ColorsPageProps {
  onBack: () => void;
}

export default function ColorsPage({ onBack }: ColorsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allColorTokens.map(token => token.seismic_category_path)));
    return ["all", ...cats.sort()];
  }, []);

  // Filter tokens
  const filteredTokens = useMemo(() => {
    return allColorTokens.filter(token => {
      const matchesSearch = 
        token.seismic_token_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.arc_token_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.seismic_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.arc_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.seismic_category_path.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || token.seismic_category_path === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);
  const paginatedTokens = filteredTokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyToClipboard = (text: string, label: string) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make it invisible and off-screen but still focusable
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');
      
      // Add to DOM
      document.body.appendChild(textArea);
      
      // Focus and select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);
      
      // Execute copy command
      const successful = document.execCommand('copy');
      
      // Remove from DOM
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopiedToken(label);
        setTimeout(() => setCopiedToken(null), 1200);
        
        toast('Copied to clipboard', {
          style: {
            background: '#000',
            color: '#fff',
            border: 'none',
          },
          position: 'bottom-center',
          duration: 1500,
        });
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      toast('Failed to copy', {
        style: {
          background: '#000',
          color: '#fff',
          border: 'none',
        },
        position: 'bottom-center',
        duration: 1500,
      });
    }
  };

  const getStatusBadge = (status: string, deltae: string) => {
    if (status === "Exact") {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Exact Match (ΔE {deltae})</Badge>;
    } else if (status === "Close") {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Close (ΔE {deltae})</Badge>;
    } else {
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Flagged (ΔE {deltae})</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 
              className="mb-2"
              style={typographyStyles.h2}
            >
              Brand 2.0 Color System Explorer
            </h1>
            <p 
              className="text-gray-600"
              style={typographyStyles.bodySmall}
            >
              Interactive color token comparison between Seismic and Arc design systems
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by token name, value, or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap">Categories:</label>
            <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
              <PopoverTrigger asChild>
                <button
                  role="combobox"
                  aria-expanded={openCategoryPopover}
                  className="inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-input bg-white text-foreground hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 w-64"
                >
                  <span className="text-left flex-1 truncate">
                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category}
                          value={category}
                          onSelect={() => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                            setOpenCategoryPopover(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedCategory === category ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {category === "all" ? "All Categories" : category}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap">Tokens per page:</label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-24 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 border rounded-md bg-white p-1 w-fit">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 px-3"
            >
              <ListIcon className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="h-7 px-3"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Cards
            </Button>
          </div>
        </div>

        {/* Results count and legend */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {paginatedTokens.length} of {filteredTokens.length} tokens
          </p>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
              <span>Exact</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
              <span>Close</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200"></div>
              <span>Flagged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color tokens grid */}
      <div className="max-w-7xl mx-auto">
        {viewMode === "list" ? (
          <div className="grid gap-4">
            {paginatedTokens.map((token, index) => {
            const copyId = `${token.seismic_token_name}-${index}`;
            
            return (
              <Card key={copyId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Seismic */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="text-xs">Seismic</Badge>
                        <Badge variant="outline" className="text-xs text-gray-600">
                          {token.seismic_category_path}
                        </Badge>
                      </div>
                      
                      {/* Color Swatch */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: token.seismic_value }}
                          title={token.seismic_value}
                        />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Hex Value</div>
                          <div className="flex items-center gap-1">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {token.seismic_value}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(token.seismic_value, `${copyId}-seismic-value`)}
                              className="h-7 w-7 p-0"
                            >
                              {copiedToken === `${copyId}-seismic-value` ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Token Name */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Design Token</div>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 break-all">
                            {token.seismic_token_name}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.seismic_token_name, `${copyId}-seismic-name`)}
                            className="h-7 w-7 p-0 flex-shrink-0"
                          >
                            {copiedToken === `${copyId}-seismic-name` ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Middle Column: Comparison */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <ArrowRight className="h-5 w-5 text-gray-400 hidden lg:block" />
                      <div className="lg:hidden w-full h-px bg-gray-200"></div>
                      {getStatusBadge(token.status, token.deltae_2000)}
                      {token.seismic_value !== token.arc_value && (
                        <p className="text-xs text-gray-500 text-center">
                          Colors differ
                        </p>
                      )}
                    </div>

                    {/* Right Column: Arc */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Arc</Badge>
                      </div>
                      
                      {/* Color Swatch */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: token.arc_value }}
                          title={token.arc_value}
                        />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Hex Value</div>
                          <div className="flex items-center gap-1">
                            <code className="text-sm bg-blue-50 px-2 py-1 rounded">
                              {token.arc_value}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(token.arc_value, `${copyId}-arc-value`)}
                              className="h-7 w-7 p-0"
                            >
                              {copiedToken === `${copyId}-arc-value` ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Token Name */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Design Token</div>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-blue-50 px-2 py-1 rounded flex-1 break-all">
                            {token.arc_token_name}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.arc_token_name, `${copyId}-arc-name`)}
                            className="h-7 w-7 p-0 flex-shrink-0"
                          >
                            {copiedToken === `${copyId}-arc-name` ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        ) : (
          <div className="grid gap-4" style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            maxWidth: '100%'
          }}>
            {paginatedTokens.map((token, index) => {
              const copyId = `${token.seismic_token_name}-${index}`;
              
              return (
                <Card key={copyId} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardContent className="p-4 flex flex-col">
                    {/* Header: Category and Status */}
                    <div className="flex flex-col gap-2 mb-3">
                      <Badge variant="outline" className="text-xs text-gray-600 self-start">
                        {token.seismic_category_path}
                      </Badge>
                      {getStatusBadge(token.status, token.deltae_2000)}
                    </div>

                    {/* Color Swatches Side by Side */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Seismic Swatch */}
                      <div className="flex flex-col">
                        <Badge variant="secondary" className="text-xs mb-2 self-start">Seismic</Badge>
                        <div 
                          className="w-full aspect-square rounded-lg border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: token.seismic_value }}
                          title={token.seismic_value}
                        />
                      </div>
                      
                      {/* Arc Swatch */}
                      <div className="flex flex-col">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs mb-2 self-start">Arc</Badge>
                        <div 
                          className="w-full aspect-square rounded-lg border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: token.arc_value }}
                          title={token.arc_value}
                        />
                      </div>
                    </div>

                    {/* Color Information */}
                    <div className="space-y-3">
                      {/* Seismic Values */}
                      <div className="space-y-1.5">
                        <div className="text-xs text-gray-500">Seismic</div>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                            {token.seismic_value}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.seismic_value, `${copyId}-seismic-value`)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            {copiedToken === `${copyId}-seismic-value` ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-gray-100 px-1.5 py-1 rounded flex-1 truncate" title={token.seismic_token_name}>
                            {token.seismic_token_name}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.seismic_token_name, `${copyId}-seismic-name`)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            {copiedToken === `${copyId}-seismic-name` ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-2">
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                          </span>
                        </div>
                      </div>

                      {/* Arc Values */}
                      <div className="space-y-1.5">
                        <div className="text-xs text-gray-500">Arc</div>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-blue-50 px-2 py-1 rounded flex-1 truncate">
                            {token.arc_value}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.arc_value, `${copyId}-arc-value`)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            {copiedToken === `${copyId}-arc-value` ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-blue-50 px-1.5 py-1 rounded flex-1 truncate" title={token.arc_token_name}>
                            {token.arc_token_name}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.arc_token_name, `${copyId}-arc-name`)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            {copiedToken === `${copyId}-arc-name` ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-9 h-9 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Empty state */}
        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 style={typographyStyles.h4} className="text-gray-900 mb-2">
              No tokens found
            </h3>
            <p className="text-sm text-gray-600">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
