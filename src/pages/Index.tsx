import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const carBrands = [
  'Lada', 'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Chevrolet',
  'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Volvo', 'Porsche'
];

const modelsByBrand: Record<string, string[]> = {
  'Lada': ['Vesta', 'Granta', 'Largus', 'Niva', 'Kalina', 'Priora', 'Samara', 'XRAY'],
  'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X7'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLE', 'GLC', 'S-Class'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Polo', 'Jetta'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Prius'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
  'Ford': ['Focus', 'Mustang', 'Explorer', 'F-150', 'Escape'],
  'Chevrolet': ['Malibu', 'Silverado', 'Equinox', 'Tahoe', 'Camaro'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Maxima'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona'],
  'Kia': ['Optima', 'Sorento', 'Sportage', 'Rio', 'Telluride'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5'],
  'Subaru': ['Impreza', 'Outback', 'Forester', 'Crosstrek', 'Legacy'],
  'Lexus': ['ES', 'RX', 'NX', 'GX', 'LS'],
  'Volvo': ['S60', 'S90', 'XC60', 'XC90', 'V60'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan']
};

const years = Array.from({ length: 30 }, (_, i) => (2024 - i).toString());

interface ElectricalScheme {
  id: number;
  brand: string;
  model: string;
  year: string;
  name: string;
  imageUrl: string;
}

const Index = () => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [schemes, setSchemes] = useState<ElectricalScheme[]>([
    {
      id: 1,
      brand: 'BMW',
      model: '3 Series',
      year: '2020',
      name: 'Система зажигания',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 2,
      brand: 'BMW',
      model: '3 Series',
      year: '2020',
      name: 'Освещение',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 3,
      brand: 'Audi',
      model: 'A4',
      year: '2019',
      name: 'Система зарядки',
      imageUrl: '/placeholder.svg'
    }
  ]);
  const [selectedScheme, setSelectedScheme] = useState<ElectricalScheme | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newSchemeName, setNewSchemeName] = useState('');
  const [uploadBrand, setUploadBrand] = useState('');
  const [uploadModel, setUploadModel] = useState('');
  const [uploadYear, setUploadYear] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const availableModels = selectedBrand ? modelsByBrand[selectedBrand] || [] : [];

  const filteredSchemes = schemes.filter(scheme => {
    if (selectedBrand && scheme.brand !== selectedBrand) return false;
    if (selectedModel && scheme.model !== selectedModel) return false;
    if (selectedYear && scheme.year !== selectedYear) return false;
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUpload = () => {
    if (!uploadBrand || !uploadModel || !uploadYear || !newSchemeName) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: 'Ошибка',
        description: 'Выберите файл изображения',
        variant: 'destructive'
      });
      return;
    }

    const imageUrl = URL.createObjectURL(uploadedFile);

    const newScheme: ElectricalScheme = {
      id: schemes.length + 1,
      brand: uploadBrand,
      model: uploadModel,
      year: uploadYear,
      name: newSchemeName,
      imageUrl: imageUrl
    };

    setSchemes([...schemes, newScheme]);
    setUploadDialogOpen(false);
    setNewSchemeName('');
    setUploadBrand('');
    setUploadModel('');
    setUploadYear('');
    setUploadedFile(null);

    toast({
      title: 'Успешно',
      description: 'Схема добавлена'
    });
  };

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
  };

  const handleSaveToDevice = (scheme: ElectricalScheme) => {
    const link = document.createElement('a');
    link.href = scheme.imageUrl;
    link.download = `${scheme.brand}_${scheme.model}_${scheme.year}_${scheme.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Сохранено',
      description: 'Схема сохранена на устройство'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
                <Icon name="Zap" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AutoScheme</h1>
                <p className="text-xs text-muted-foreground">Электрические схемы автомобилей</p>
              </div>
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon name="Upload" size={18} />
                  Загрузить схему
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Загрузка новой схемы</DialogTitle>
                  <DialogDescription>
                    Заполните информацию об электрической схеме
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload-brand">Марка</Label>
                    <Select value={uploadBrand} onValueChange={setUploadBrand}>
                      <SelectTrigger id="upload-brand">
                        <SelectValue placeholder="Выберите марку" />
                      </SelectTrigger>
                      <SelectContent>
                        {carBrands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-model">Модель</Label>
                    <Select 
                      value={uploadModel} 
                      onValueChange={setUploadModel}
                      disabled={!uploadBrand}
                    >
                      <SelectTrigger id="upload-model">
                        <SelectValue placeholder="Выберите модель" />
                      </SelectTrigger>
                      <SelectContent>
                        {uploadBrand && modelsByBrand[uploadBrand]?.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload-year">Год</Label>
                    <Select value={uploadYear} onValueChange={setUploadYear}>
                      <SelectTrigger id="upload-year">
                        <SelectValue placeholder="Выберите год" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheme-name">Название схемы</Label>
                    <Input
                      id="scheme-name"
                      placeholder="Например: Система зажигания"
                      value={newSchemeName}
                      onChange={(e) => setNewSchemeName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheme-file">Файл схемы</Label>
                    <Input
                      id="scheme-file"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleFileChange}
                    />
                    {uploadedFile && (
                      <p className="text-sm text-muted-foreground">
                        Выбран файл: {uploadedFile.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleUpload}>
                    Загрузить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Filter" size={20} />
              Фильтры поиска
            </CardTitle>
            <CardDescription>
              Выберите параметры для поиска электрических схем
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Марка</Label>
                <Select value={selectedBrand} onValueChange={(value) => {
                  setSelectedBrand(value);
                  setSelectedModel('');
                }}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Все марки" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Модель</Label>
                <Select 
                  value={selectedModel} 
                  onValueChange={setSelectedModel}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Все модели" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Год</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Все годы" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={resetFilters}
                >
                  <Icon name="X" size={18} />
                  Сбросить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Найденные схемы</h2>
            <p className="text-sm text-muted-foreground">
              {filteredSchemes.length} {filteredSchemes.length === 1 ? 'схема' : 'схем'}
            </p>
          </div>
        </div>

        {filteredSchemes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Icon name="FileSearch" size={64} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Схемы не найдены</h3>
              <p className="text-muted-foreground text-center">
                Попробуйте изменить параметры фильтрации
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map(scheme => (
              <Card 
                key={scheme.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedScheme(scheme)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{scheme.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {scheme.brand} {scheme.model} • {scheme.year}
                      </CardDescription>
                    </div>
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                      <Icon name="FileText" className="text-primary" size={20} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded border border-border flex items-center justify-center">
                    <Icon name="Image" size={48} className="text-muted-foreground" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Icon name="Eye" size={16} />
                      Просмотр
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveToDevice(scheme);
                      }}
                    >
                      <Icon name="Download" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!selectedScheme} onOpenChange={() => setSelectedScheme(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedScheme?.name}</DialogTitle>
            <DialogDescription>
              {selectedScheme?.brand} {selectedScheme?.model} • {selectedScheme?.year}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded border border-border flex items-center justify-center">
            <Icon name="Image" size={96} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="flex-1 gap-2"
              onClick={() => selectedScheme && handleSaveToDevice(selectedScheme)}
            >
              <Icon name="Download" size={18} />
              Сохранить на устройство
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Icon name="Printer" size={18} />
              Печать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;